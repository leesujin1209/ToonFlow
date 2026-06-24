import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side lazy initialization of Gemini API
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Gemini API:", err);
    }
  } else {
    console.warn("GEMINI_API_KEY is missing or contains placeholder. Running in fallback simulation mode.");
  }

  // AI-based Deadline Risk Analysis Endpoint
  app.post("/api/analyze-risk", async (req, res) => {
    try {
      const { project, episodes = [], characters = [], tasks = [], foreshadowings = [] } = req.body;

      if (!project) {
        return res.status(400).json({ error: "프로젝트 정보가 누락되었습니다." });
      }

      // Prepare background text data for prompt
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t: any) => t.status === "completed").length;
      const pendingTasks = tasks.filter((t: any) => t.status === "pending").length;
      const highPriorityPending = tasks.filter((t: any) => t.status === "pending" && t.priority === "high").length;
      
      const totalEpisodes = episodes.length;
      const completedEpisodes = episodes.filter((e: any) => e.status === "completed").length;
      const ongoingEpisodes = episodes.filter((e: any) => e.status !== "completed" && e.status !== "planning").length;

      const totalForeshadowings = foreshadowings.length;
      const unresolvedForeshadowings = foreshadowings.filter((f: any) => f.status === "unresolved").length;

      // Calculate time remaining to deadline
      const deadline = new Date(project.endDate);
      const today = new Date();
      const timeDiff = deadline.getTime() - today.getTime();
      const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

      if (ai) {
        const prompt = `
          웹툰 작가의 연재 프로젝트 현황을 보고 마감 일정 지연 리스크를 종합적으로 분석해줘.
          
          [프로젝트 기본 정보]
          - 제목: ${project.title}
          - 장르: ${project.genre}
          - 연재 주기: ${project.serializationCycle}
          - 목표 마감일: ${project.endDate} (남은 일수: ${daysRemaining}일)
          - 현재 수동 기록 진행률: ${project.progress}%

          [작업(To-Do) 현황]
          - 총 할 일: ${totalTasks}개 (완료: ${completedTasks}개, 미완료: ${pendingTasks}개)
          - 높은 우선순위 미완료 할 일: ${highPriorityPending}개

          [회차(스토리) 현황]
          - 총 등록 회차: ${totalEpisodes}회 (완료된 회차: ${completedEpisodes}회, 작업중인 회차: ${ongoingEpisodes}회)

          [복선(떡밥) 현황]
          - 등록된 복선: ${totalForeshadowings}개 (미회수 복선: ${unresolvedForeshadowings}개)

          [캐릭터 수]: ${characters.length}명

          위 데이터를 정밀 분석하여 다음 형식의 JSON 객체로 마감 리스크 보고서를 작성해줘.
          - riskScore: 0~100 사이의 마감 지연 위험도 점수 (숫자)
          - riskLevel: 'low' | 'medium' | 'high' 중 하나
          - summary: 리스크 상황에 대한 전반적인 요약 및 상황 판단 (한국어, 3-4문장)
          - causes: 리스크를 높이는 주요 원인 목록 (문자열 배열, 2-3개)
          - suggestions: 일정을 맞추기 위한 AI 추천 개선 방안 목록 (문자열 배열, 3개 이상 구체적이고 현실적인 가이드라인 제공)
        `;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  riskScore: {
                    type: Type.INTEGER,
                    description: "마감 지연 리스크 점수 (0-100)",
                  },
                  riskLevel: {
                    type: Type.STRING,
                    description: "위험 수준 ('low', 'medium', 'high')",
                  },
                  summary: {
                    type: Type.STRING,
                    description: "현 상황에 대한 AI 요약 분석 내용",
                  },
                  causes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "지연 위험 요인들",
                  },
                  suggestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "위험을 낮추기 위한 구체적 솔루션 목록",
                  },
                },
                required: ["riskScore", "riskLevel", "summary", "causes", "suggestions"],
              },
            },
          });

          const resultText = response.text || "{}";
          const report = JSON.parse(resultText);
          return res.json({
            ...report,
            analyzedAt: new Date().toISOString(),
          });
        } catch (apiError: any) {
          console.error("Gemini API call failed, switching to local analysis rule-engine:", apiError);
        }
      }

      // FALLBACK RULE-ENGINE (Used if Gemini API Key is missing or if the API request fails)
      // Make a high-quality heuristic risk evaluation
      let calculatedScore = 30; // base risk
      
      // Heuristics
      if (daysRemaining < 7) {
        calculatedScore += 40;
      } else if (daysRemaining < 14) {
        calculatedScore += 25;
      } else if (daysRemaining < 30) {
        calculatedScore += 10;
      }

      if (totalTasks > 0) {
        const completionRate = completedTasks / totalTasks;
        if (completionRate < 0.3) {
          calculatedScore += 25;
        } else if (completionRate < 0.6) {
          calculatedScore += 15;
        } else if (completionRate > 0.9) {
          calculatedScore -= 15;
        }
      } else {
        calculatedScore += 10; // No tasks registered is a mild planning risk
      }

      if (highPriorityPending > 2) {
        calculatedScore += 15;
      }

      if (unresolvedForeshadowings > 4) {
        calculatedScore += 5; // Unrecovered plot devices add narrative risk
      }

      // Clamp risk score
      calculatedScore = Math.max(5, Math.min(95, calculatedScore));

      let level: 'low' | 'medium' | 'high' = 'low';
      if (calculatedScore >= 70) {
        level = 'high';
      } else if (calculatedScore >= 40) {
        level = 'medium';
      }

      const isKeyMissing = !apiKey || apiKey === "MY_GEMINI_API_KEY";
      const modeNotice = isKeyMissing
        ? "⚠️ [알림] 현재 GEMINI_API_KEY 설정이 누락되어 로컬 엔진으로 임시 분석되었습니다. AI Studio [Settings > Secrets] 탭에서 API Key를 추가하시면 더욱 고도화된 맞춤형 스토리 피드백과 지연 예측 의견을 제공받을 수 있습니다."
        : "⚙️ [알림] Gemini API 서비스 응답에 일시적 장애가 있어 시스템 규칙 엔진을 통해 마감 리스크를 신속 산출했습니다.";

      const KoreanFallbacks = {
        high: {
          summary: `마감 목표일(${project.endDate})까지 단 ${daysRemaining}일 남았지만, 중요 미완료 할 일이 다수 남아있어 일정 지연 위험성이 매우 높습니다. ${modeNotice}`,
          causes: [
            "우선순위가 높은 핵심 작업(스케치, 펜선 등)들이 완료되지 않은 채 마감일이 임박함.",
            "미해결 회차 비율이 높아 스토리 완결 흐름이 급박하게 작성될 위험이 있음.",
            "진행률에 비해 할 일 해결 속도가 다소 더딘 편입니다."
          ],
          suggestions: [
            "오늘 즉시 미완료 핵심 작업(고우선순위 할 일)들을 재조정하여 작화 분량을 축소하거나 마감 지원 헬퍼를 영입하세요.",
            "3막 구조에 지장을 주지 않는 선에서 불필요한 연출 컷수를 과감히 줄여 마감 일정을 사수해야 합니다.",
            "남은 복선 회수를 차회로 미루더라도 이번 화 엔딩 훅과 핵심 작화에 집중하십시오."
          ]
        },
        medium: {
          summary: `연재 마감까지 ${daysRemaining}일이 남아 있으며, 리스크 수준은 보통입니다. 작업 완수율과 회차 관리 상태가 안정권에 접어들기 위해서는 일정 관리 밀도를 조금 더 조여야 합니다. ${modeNotice}`,
          causes: [
            "작업량 관리가 원활하나, 회차 설정 오류나 미완성 세부 씬이 집중될 가능성 존재.",
            "미해결 떡밥/복선이 ${unresolvedForeshadowings}개 있어 연출 분량이 의도치 않게 늘어날 수 있음."
          ],
          suggestions: [
            "각 회차별 스토리보드 컷수(${totalEpisodes > 0 ? '평균 컷수' : '임시 지정'} 제한)를 일정하게 통제해 변수를 없애세요.",
            "매일 진행할 우선순위 To-Do 카드를 2개 이내로 명확히 마킹하여 작업 완료를 체크해 나가십시오.",
            "등장인물 간의 불필요한 감정선 씬을 압축하여 본 스토리 전개 속도를 조금 더 당기시기 바랍니다."
          ]
        },
        low: {
          summary: `일정 관리 상태가 아주 훌륭합니다! 마감 목표일까지 시간적 여유가 충분하고, 등록된 할 일 완료율이 준수하여 작업 부담이 거의 없습니다. ${modeNotice}`,
          causes: [
            "목표 계획 수립이 꼼꼼하게 이루어졌으며 연재 속도에 여유가 있어 쾌적한 상황임.",
            "진행 중인 회차와 캐릭터 설정 간의 정합성이 뛰어나 안정적이고 완성도 높은 원고가 기대됨."
          ],
          suggestions: [
            "지금의 훌륭한 작업 리듬을 그대로 유지하되, 세부 캐릭터 묘사나 후반부 연출 디테일을 강화하는 데 여분의 시간을 투자해보세요.",
            "비축분을 1~2회 추가로 마련해 돌발 연재 휴재 위험에 영리하게 대비할 것을 권장합니다.",
            "작성한 3막 구조의 복선 중 독자가 예상하기 좋은 요소를 정밀 수정하는 시간을 가져보세요."
          ]
        }
      };

      const selectedFallback = KoreanFallbacks[level];

      return res.json({
        riskScore: calculatedScore,
        riskLevel: level,
        summary: selectedFallback.summary,
        causes: selectedFallback.causes,
        suggestions: selectedFallback.suggestions,
        analyzedAt: new Date().toISOString(),
      });

    } catch (err: any) {
      console.error("Critical error in risk analysis endpoint:", err);
      return res.status(500).json({ error: "분석 처리 중 중대한 서버 에러가 발생했습니다." });
    }
  });

  // Serve static assets or use Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files mounted from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});

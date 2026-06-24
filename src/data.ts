import { Project, Character, Foreshadowing, Episode, Task } from "./types";

export const initialProject: Project = {
  id: "proj-1",
  title: "낭만 검객 (Romantic Swordsman)",
  genre: "무협 / 판타지",
  serializationCycle: "weekly",
  status: "ongoing",
  progress: 65,
  startDate: "2026-05-01",
  endDate: "2026-08-30",
  createdAt: "2026-05-01T10:00:00Z",
  actStructure: {
    introduction: "명문 세가 출신이지만 기혈이 막혀 무시받던 서자 유백이 동굴에서 우연히 '천마의 검'과 검집을 주워 비전 무공을 터득한다.",
    confrontation: "가문의 박해를 피해 낙양으로 가 강호의 세력들과 교류하며, 무림맹 고위층 내 마교 첩자의 존재와 음모를 눈치챈다.",
    resolution: "첩자 무리들과 숙적인 마교의 교주를 단독 결투로 제압하고, 진정한 은둔 고수 '낭만 검객'으로 소박한 삶으로 복귀한다."
  }
};

export const initialCharacters: Character[] = [
  {
    id: "char-1",
    projectId: "proj-1",
    name: "유백 (Yoo-Baek)",
    role: "main",
    personality: "겉으로는 귀차니스트에 능글맞아 보이지만, 속마음은 타인을 극진히 생각하고 도리를 지키는 사려 깊은 성정.",
    appearance: "덥수룩하고 자연스럽게 묶은 검은 머리칼, 평소에는 낡고 편한 푸른 도포 차림. 날카로우면서도 깊은 눈빛.",
    relationships: "백련하(동료/조력자) - 자주 구박하지만 생사를 함께하는 영혼의 파트너. 혈사독(숙적) - 유백의 성장을 시기하고 기습을 가함.",
    conflicts: "천마검법의 핵심 기공은 쓸 때마다 혈맥을 극심히 갉아먹는 심각한 리스크가 있으며, 극적인 위기가 아니면 사용을 자제하려 함."
  },
  {
    id: "char-2",
    projectId: "proj-1",
    name: "백련하 (Baek Ryun-Ha)",
    role: "main",
    personality: "낙양 상단의 실질적 정보 대장이자 냉철하고 이성적인 판단력의 소유자. 유백의 든든한 금전·정보적 조력자.",
    appearance: "화려한 붉은색 비단 쾌자, 허리에는 상단을 상징하는 백색 장식패 소지. 똑 부러지는 이목구비.",
    relationships: "유백(신뢰) - 게으른 유백을 수시로 챙겨주고 한편으론 동정하며 상인으로서의 가치를 높게 평가함.",
    conflicts: "낙양 상단 내 친족들이 상권을 완전히 독식하기 위해 마교 세력과 결탁해 자신을 위협하려 함."
  },
  {
    id: "char-3",
    projectId: "proj-1",
    name: "혈사독 (Hyeol-Sa-Dok)",
    role: "supporting",
    personality: "비열하고 잔혹함. 수단과 방법을 가리지 않고 목적을 달성하는 음침한 무림의 살수.",
    appearance: "창백한 흑색 가죽 옷, 얼굴 한쪽에 긴 화상 흉터가 있으며 독이 묻은 비수를 상시 지참.",
    relationships: "유백(표적) - 유백의 천마의 검을 탈취하고 기운을 흡수해 승천하고자 함.",
    conflicts: "가문 내부 권력자에게 고용되었으나 실상 자신만의 독립된 대마교의 힘을 얻고자 뒤에서 비밀리에 배신을 모의함."
  }
];

export const initialForeshadowings: Foreshadowing[] = [
  {
    id: "fore-1",
    projectId: "proj-1",
    description: "1화: 동굴 속 녹슨 검집 표면에 정교하게 음각된 '무명백화(無名白花)' 무늬",
    episodeRegistered: "1화",
    status: "resolved",
    episodeResolved: "8화 (무림맹 백화 장로의 사연 고백)"
  },
  {
    id: "fore-2",
    projectId: "proj-1",
    description: "유백의 왼손바닥에 각인된 세 갈래 번개 흉터가 특정한 사기(邪氣)를 느낄 때마다 욱신거리는 성질",
    episodeRegistered: "3화",
    status: "unresolved",
    episodeResolved: ""
  },
  {
    id: "fore-3",
    projectId: "proj-1",
    description: "마교 첩자가 정기적으로 은밀한 서신을 낙양 객잔 뒤뜰 대나무 숲 아래에 파묻는 모습",
    episodeRegistered: "5화",
    status: "unresolved",
    episodeResolved: ""
  }
];

export const initialEpisodes: Episode[] = [
  {
    id: "ep-1",
    projectId: "proj-1",
    chapterNumber: 1,
    title: "천마의 검과 기연의 동굴",
    summary: "도망치듯 강호의 낭인 생활을 전전하던 유백이 포위망을 피해 들어간 깊은 산속 은둔지에서 기이한 힘에 끌려 동굴 속 비검을 습득한다.",
    status: "completed",
    panelCount: 65,
    endingHook: "추격 무사들이 유백이 뽑아든 천마의 검에서 피어나는 칠흑 같은 기운을 목격하고 경악하며 끝나는 장면.",
    scenes: [
      {
        id: "scene-1-1",
        index: 1,
        description: "추격 무사들이 횃불을 들고 어두운 야산 속으로 깊숙이 진입하는 추적 전개.",
        cuts: "1컷: 장대비가 쏟아지는 산속 전경.\n2컷: 추격대장의 위협적인 클로즈업.\n3컷: 땅 위의 발자국을 살피는 수하들.",
        endingHook: "수하 중 하나가 동굴의 정문을 찾아내며 소리친다."
      },
      {
        id: "scene-1-2",
        index: 2,
        description: "동굴 안쪽에서 신비로운 기운을 내뿜는 '천마의 검'을 마침내 유백이 뽑아 드는 시점.",
        cuts: "4컷: 한 대의 비장한 한숨을 짓는 유백.\n5컷: 덩굴 사이에 박힌 무거운 석검을 두 손으로 감싼 유백.\n6컷: 검을 치켜올리자 동굴 내부가 파랗게 진동함.",
        endingHook: "강한 역광 속에서 유백의 비장한 안광."
      }
    ]
  },
  {
    id: "ep-2",
    projectId: "proj-1",
    chapterNumber: 2,
    title: "낙양성으로 향하는 길목",
    summary: "무공의 비결을 몸에 익힌 유백은 정체를 숨기기 위해 낙양의 번화가로 떠나고, 그곳에서 대 상단 정보원 백련하와 첫 만남을 가진다.",
    status: "storyboarding",
    panelCount: 55,
    endingHook: "백련하가 주던 명패 뒤에 유백이 도망쳐 나온 가문의 무공 문양이 각인되어 있는 소름 끼치는 암시.",
    scenes: [
      {
        id: "scene-2-1",
        index: 1,
        description: "낙양의 시끌벅적하고 화려한 객잔과 낙양 상단의 정보 교환실 배경.",
        cuts: "1컷: 낙양성의 웅장한 도심 정경.\n2컷: 구석에서 소박하게 만두를 먹으며 정보를 수집하는 유백.\n3컷: 백련하가 우아하게 다가와 자리에 앉음.",
        endingHook: "백련하가 잔을 권하며 의미심장한 미소를 짓는 컷."
      }
    ]
  },
  {
    id: "ep-3",
    projectId: "proj-1",
    chapterNumber: 3,
    title: "객잔의 자객과 대격돌",
    summary: "혈사독이 보낸 자객들이 밤을 틈타 낙양 객잔을 습격하고, 유백은 새로운 무공을 쓰지 않고 은밀한 신법으로 자객들을 퇴치해야 하는 제약에 부딪힌다.",
    status: "planning",
    panelCount: 60,
    endingHook: "어둠 속에서 자객의 비수에 독이 묻어있음을 뒤늦게 깨닫는 백련하의 불안한 응시.",
    scenes: [
      {
        id: "scene-3-1",
        index: 1,
        description: "적막해진 심야의 낙양 객잔, 지붕 위로 의문의 암살 단체 무사들이 접근하는 긴박한 연출.",
        cuts: "1컷: 달이 먹구름에 가려지는 밤하늘.\n2컷: 기와 지붕을 소리 없이 달리는 자객들의 도포 자락.\n3컷: 깊은 수면에 든 척하며 귀를 쫑긋 세우는 유백의 방 전경.",
        endingHook: "장지문 틈으로 들어오는 은빛 살수 비수 클로즈업."
      }
    ]
  }
];

export const initialTasks: Task[] = [
  {
    id: "task-1",
    projectId: "proj-1",
    title: "1화 완성본 작화 검수 및 파일 업로드",
    dueDate: "2026-06-25",
    status: "completed",
    priority: "high"
  },
  {
    id: "task-2",
    projectId: "proj-1",
    title: "2화스토리보드(콘티) 피드백 반영 및 컷 분할 수정",
    dueDate: "2026-06-28",
    status: "pending",
    priority: "high"
  },
  {
    id: "task-3",
    projectId: "proj-1",
    title: "3화 작화 가이드 및 자객 무기 설정시트 완성",
    dueDate: "2026-07-03",
    status: "pending",
    priority: "medium"
  },
  {
    id: "task-4",
    projectId: "proj-1",
    title: "작가 개인 어시스턴트 채용 공고 리서치",
    dueDate: "2026-07-10",
    status: "pending",
    priority: "low"
  }
];

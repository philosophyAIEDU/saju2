document.addEventListener('DOMContentLoaded', () => {
    // Supabase Configuration
    const SUPABASE_URL = 'https://vhptyvnutvdloekbtoef.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocHR5dm51dHZkbG9la2J0b2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzg1MjIsImV4cCI6MjA4NTYxNDUyMn0.ino0oJp0g705pD3W2Q36O-GGVgdXWTouoCxOw0OlC7Y';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const sajuForm = document.getElementById('saju-form');
    const inputSection = document.getElementById('input-section');
    const resultSection = document.getElementById('result-section');
    const retryButton = document.getElementById('retry-button');

    // 10 Heavenly Stems (천간)
    const stems = ["갑(甲)", "을(을)", "병(丙)", "정(丁)", "무(戊)", "기(己)", "경(庚)", "신(辛)", "임(壬)", "계(癸)"];

    // 12 Earthly Branches (지지)
    const branches = ["자(子)", "축(丑)", "인(寅)", "묘(卯)", "진(辰)", "사(巳)", "오(午)", "미(未)", "신(申)", "유(酉)", "술(戌)", "해(亥)"];

    // Simplified Saju Data (Demo purpose)
    const natureReadings = [
        "당신은 큰 숲과 같은 기운을 가졌습니다. 곧고 강직하며 리더십이 뛰어납니다.",
        "태양처럼 밝고 따뜻한 에너지를 가졌군요. 주변을 밝히는 사교적인 성격입니다.",
        "단단한 대지와 같은 포용력을 지녔습니다. 믿음직스럽고 실천력이 좋습니다.",
        "날카로운 보검처럼 섬세하고 단호한 면모가 있습니다. 명예와 원칙을 중시합니다.",
        "깊은 바다와 같은 지혜를 가졌습니다. 유연한 사고방식과 창의력이 돋보입니다."
    ];

    sajuForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('user-name').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const calendarType = document.querySelector('input[name="calendar"]:checked').value;
        const birthDateStr = document.getElementById('birth-date').value;
        const birthDate = new Date(birthDateStr);
        const birthTime = document.getElementById('birth-time').value;

        // Save data to Supabase
        try {
            const { error } = await supabase
                .from('saju_requests')
                .insert([
                    {
                        name: name,
                        gender: gender,
                        birth_date: birthDateStr,
                        birth_time: birthTime,
                        calendar_type: calendarType
                    }
                ]);

            if (error) {
                console.error('Error saving to Supabase:', error);
            } else {
                console.log('Successfully saved to Supabase');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }

        // Simplified Saju calculation based on birth date
        const year = birthDate.getFullYear();
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();

        const yearStem = stems[year % 10];
        const yearBranch = branches[year % 12];

        const monthStem = stems[(year + month) % 10];
        const monthBranch = branches[(month + 2) % 12];

        const dayStem = stems[(year + month + day) % 10];
        const dayBranch = branches[(day + 5) % 12];

        let hourStem = "--";
        let hourBranch = "--";
        if (birthTime !== "unknown") {
            const h = parseInt(birthTime);
            hourStem = stems[(day + h) % 10];
            hourBranch = branches[Math.floor((h + 1) / 2) % 12];
        }

        // Display results
        document.getElementById('year-pillar').innerHTML = `${yearStem}<br>${yearBranch}`;
        document.getElementById('month-pillar').innerHTML = `${monthStem}<br>${monthBranch}`;
        document.getElementById('day-pillar').innerHTML = `${dayStem}<br>${dayBranch}`;
        document.getElementById('hour-pillar').innerHTML = `${hourStem}<br>${hourBranch}`;

        document.getElementById('result-title').innerText = `${name}님의 운세 결과`;

        // Random but deterministic-like reading
        const readingIndex = (year + month + day) % natureReadings.length;
        document.getElementById('nature-reading').innerText = natureReadings[readingIndex];

        // Transitions
        inputSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        // Scroll to top
        window.scrollTo(0, 0);
    });

    retryButton.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
    });
});

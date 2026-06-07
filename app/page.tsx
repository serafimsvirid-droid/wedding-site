"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Wine,
  Heart,
  Mic,
  Music,
  Stars,
  Send,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1 },
  },
};

const timeline = [
  { time: "15:00", title: "Welcome", text: "Неспеша собираемся и знакомимся", icon: Wine },
  { time: "16:00", title: "Церемония регистрации", text: "Регистрация брака с обменом клятвами", icon: Heart },
  { time: "16:30", title: "Основная программа", text: "Ужин, музыка и праздничная атмосфера", icon: Mic },
  { time: "22:00", title: "Танцы", text: "Музыка, танцы и вечерняя атмосфера", icon: Music },
  { time: "23:00", title: "Завершение вечера", text: "Спасибо, что были с нами", icon: Stars },
];

const questions = [
  { q: "Есть ли дресс-код?", a: "Будем рады видеть вас в цветовой гамме нашего праздника.", image: "/Foto/dresskod.png" },
  { q: "Нужно ли дарить цветы?", a: "Ваше присутствие - лучший подарок. Но если вы хотите нас порадовать, знайте: мы не любим увядающие букеты. Будем благодарны за вклад в наш медовый месяц! Либо цветочную подписку." },
  { q: "Какие подарки предпочтительны?", a: "Мы будем рады и сюрпризам, а также поздравлениям в конверте." },
  { q: "Можно ли приехать на машине?", a: "Да, на площадке предусмотрена парковка." },
  { q: "До какого числа необходимо подтвердить присутствие?", a: "Просим вас сообщить ваше решение не позднее 31 августа." },
];

export default function WeddingPage() {
  const weddingDate = new Date("2026-10-10T15:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [step, setStep] = useState(0);
  const [attendance, setAttendance] = useState("");
  const [loading, setLoading] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [showMusicButton, setShowMusicButton] = useState(true);

  const enableMusic = () => {
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    if (audio) {
      audio.play().then(() => {
        setMusicOn(true);
        setShowMusicButton(false);
      }).catch(() => {});
    }
  };

  // --- Refs для линии ---
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dateBlockRef = useRef<HTMLDivElement>(null);
  const [lineTop, setLineTop] = useState(0);
  const [lineBottom, setLineBottom] = useState(0);

  const updateLinePosition = useCallback(() => {
    if (!timelineContainerRef.current) return;
    const items = timelineItemsRef.current.filter((item) => item !== null);
    const dateBlock = dateBlockRef.current;
    if (items.length === 0 || !dateBlock) return;

    const containerRect = timelineContainerRef.current.getBoundingClientRect();
    const dateRect = dateBlock.getBoundingClientRect();
    const lastRect = items[items.length - 1].getBoundingClientRect();

    const topRelative = dateRect.bottom - containerRect.top;
    const bottomRelative = lastRect.bottom - containerRect.top + 80;

    setLineTop(topRelative);
    setLineBottom(bottomRelative);
  }, []);

  useEffect(() => {
    updateLinePosition();
    window.addEventListener("resize", updateLinePosition);
    return () => window.removeEventListener("resize", updateLinePosition);
  }, [updateLinePosition]);

  const [form, setForm] = useState({
    guests: [""],
    food: "",
    alcohol: [] as string[],
    customAlcohol: "",
    allergy: "",
    transfer: "",
    parking: "",
    wishes: "",
    email: "",
    reason: "",
    noName: "",
    noEmail: "",
  });

  const canContinue = useMemo(() => {
    if (attendance === "no") {
      return form.noName.length > 2 && /\S+@\S+\.\S+/.test(form.noEmail);
    }
    switch (step) {
      case 0: return attendance !== "";
      case 1: return form.guests[0].length > 2;
      case 2: return form.food !== "";
      case 3: return form.alcohol.length > 0;
      case 4: return form.transfer !== "";
      case 5: return form.parking !== "";
      case 6: return /\S+@\S+\.\S+/.test(form.email);
      default: return true;
    }
  }, [attendance, step, form]);

  const toggleAlcohol = (item: string) => {
    if (form.alcohol.includes(item)) {
      setForm({ ...form, alcohol: form.alcohol.filter((i) => i !== item) });
    } else {
      setForm({ ...form, alcohol: [...form.alcohol, item] });
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendance,
          ...form,
        }),
      });
      alert("Ответ успешно отправлен ❤️");
      setOpenForm(false);
      setStep(0);
      setAttendance("");
      setForm({
        guests: [""],
        food: "",
        alcohol: [],
        customAlcohol: "",
        allergy: "",
        transfer: "",
        parking: "",
        wishes: "",
        email: "",
        reason: "",
        noName: "",
        noEmail: "",
      });
    } catch (e) {
      alert("Ошибка отправки");
    }
    setLoading(false);
  };

  useEffect(() => {
    const enableAudio = () => {
      const audio = document.getElementById("bg-music") as HTMLAudioElement;
      if (audio && !musicOn) {
        audio.play().then(() => {
          setMusicOn(true);
        }).catch(() => {});
      }
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
    };
    
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('click', enableAudio);
    
    return () => {
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
    };
  }, [musicOn]);

  const toggleMusic = () => {
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      audio.play().catch(() => {});
      setMusicOn(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = weddingDate - now;
      setTimeLeft({
        days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
        seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[#f8f4ef] text-[#2d2d2d] min-h-screen">
      <audio id="bg-music" loop src="/music/wedding.mp3" />
      
      {showMusicButton && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center flex-col gap-6 p-6">
          <div className="text-center space-y-4">
            <h2 className="text-white text-4xl md:text-5xl font-light animate-pulse">
              🎵 Свадьба Сергея & Ирины
            </h2>
            <p className="text-white/80 text-lg md:text-xl">
              Добро пожаловать на наш праздник!
            </p>
            <p className="text-white/60 text-base">
              Нажмите на кнопку, чтобы включить музыку
            </p>
          </div>
          
          <button
            onClick={enableMusic}
            className="mt-8 bg-white text-black px-12 py-5 rounded-full text-xl md:text-2xl font-medium shadow-2xl hover:bg-white/90 transition-all animate-pulse flex items-center gap-3"
          >
            <span>🔊</span>
            Включить музыку
            <span>🎵</span>
          </button>
          
          <p className="text-white/40 text-sm text-center mt-8">
            Без музыки праздник не тот 😊
          </p>
        </div>
      )}

      {/* HERO */}
      <section
        className="min-h-screen bg-cover bg-center relative flex items-center justify-center text-white px-6"
        style={{ backgroundImage: 'url("/Foto/fon.jpg")' }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-xl mx-auto"
        >
          <p className="tracking-[0.5em] uppercase text-sm mb-6">Wedding Day</p>
          <h1 className="text-6xl md:text-7xl font-light mb-5">Сергей & Ирина</h1>
          <p className="text-2xl mb-10">10.10.2026</p>
        </motion.div>
      </section>

      {/* Кнопка музыки */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleMusic}
          className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white/40 transition"
        >
          {musicOn ? <Volume2 size={20} className="text-white" /> : <VolumeX size={20} className="text-white" />}
        </button>
      </div>

      {/* INVITE */}
      <section className="py-32 px-6 bg-[#fbf8f3]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-light mb-12">Приглашение</h2>
              <p className="leading-9 text-lg mb-8 text-left">
                Дорогие друзья! Жить, любить, чувствовать. Однажды мы поняли, что нет ничего важнее этого.
                И что идти дальше мы хотим только вместе. А теперь мечтаем, чтобы день нашей свадьбы
                стал красивым и ярким событием на этом пути. Мы будем очень рады, если вы разделите
                этот счастливый день с нами.
              </p>
              <p className="text-3xl italic mt-10">
                Увидимся на нашей свадьбе <span className="text-red-500">♡</span>
              </p>
            </div>
            <div className="flex justify-center gap-8">
              <img src="/Foto/1.jpg" className="w-56 h-56 rounded-full object-cover border-[6px] border-white shadow-2xl" />
              <img src="/Foto/2.jpg" className="w-56 h-56 rounded-full object-cover border-[6px] border-white shadow-2xl mt-20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 bg-[#f6f1ea]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-5xl font-light mb-16">Ответы на вопросы</h2>
          {questions.map((item, index) => (
            <div key={index} className="border-b border-[#ddd] py-6">
              <button
                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-xl">{item.q}</span>
                {openQuestion === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              <AnimatePresence>
                {openQuestion === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-6 text-[#666] leading-8">{item.a}</p>
                    {item.image && <img src={item.image} className="mt-6 rounded-3xl" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAM */}
      <section className="py-32 px-6 bg-[#fbf8f3]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-5xl font-light mb-24">ПРОГРАММА ДНЯ</h2>

          <div ref={dateBlockRef} className="mb-20 text-center">
            <div className="text-2xl mb-2">10 Октября 2026 года</div>
            <div className="text-[#8c7b6b] tracking-[0.3em] uppercase">СУББОТА</div>
          </div>

          <div ref={timelineContainerRef} className="relative">
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="absolute w-[3px] origin-top"
              style={{
                left: "50%",
                top: lineTop,
                height: Math.max(0, lineBottom - lineTop),
                background: "linear-gradient(to bottom, transparent 0%, #a79683 15%, #a79683 85%, transparent 100%)",
                transform: "translateX(-50%)",
              }}
            />

            <div className="space-y-20">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  ref={(el) => { timelineItemsRef.current[index] = el; }}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-8"
                >
                  <div className="text-right">
                    <p className="text-3xl text-[#8f7f6d]">{item.time}</p>
                  </div>
                  <div className="relative z-10 w-20 h-20 rounded-full border-[3px] border-[#a79683] bg-[#fbf8f3] flex items-center justify-center text-3xl">
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl mb-2">{item.title}</h3>
                    <p className="text-[#666]">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLACE */}
      <section className="py-32 px-6 bg-[#f6f1ea] text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <MapPin className="mx-auto mb-6" size={40} />
          <h2 className="text-5xl font-light mb-5">Место проведения</h2>
          <p className="text-2xl mb-4">БАНКЕТНЫЙ ЗАЛ "YA-CAFE 2"</p>
          <p className="text-[#666] mb-12">Москва, улица Ленинская Слобода 19с2</p>
          <img src="/Foto/Ya-Cafe.jpg" className="rounded-[36px] shadow-2xl mb-10 mx-auto" />
          <a
            href="https://t.me/+UuSO94aY3pFkOWFi"
            target="_blank"
            className="inline-flex items-center gap-3 bg-[#2f2f2f] text-white px-8 py-4 rounded-full"
          >
            <Send size={18} /> Telegram чат гостей
          </a>
          <button
            onClick={() => setOpenForm(true)}
            className="mt-6 ml-4 inline-flex items-center gap-3 border border-[#2f2f2f] text-[#2f2f2f] px-8 py-4 rounded-full hover:bg-[#2f2f2f] hover:text-white transition-all"
          >
            <Heart size={18} /> Подтвердить присутствие
          </button>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-32 px-6 bg-[#f6f1ea] text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-5xl font-light mb-20 text-[#3d342d]">ДО НАШЕЙ СВАДЬБЫ ОСТАЛОСЬ</h2>
          <div className="grid grid-cols-2 gap-10 max-w-xl mx-auto">
            <div><div className="text-6xl mb-4 text-[#3d342d]">{timeLeft.days}</div><p className="text-[#8c7b6b]">Дней</p></div>
            <div><div className="text-6xl mb-4 text-[#3d342d]">{timeLeft.hours}</div><p className="text-[#8c7b6b]">Часов</p></div>
            <div><div className="text-6xl mb-4 text-[#3d342d]">{timeLeft.minutes}</div><p className="text-[#8c7b6b]">Минут</p></div>
            <div><div className="text-6xl mb-4 text-[#3d342d]">{timeLeft.seconds}</div><p className="text-[#8c7b6b]">Секунд</p></div>
          </div>
        </motion.div>
      </section>

      {/* RSVP FORM MODAL */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="bg-white rounded-[40px] w-full max-w-xl p-10 relative overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => { setOpenForm(false); setStep(0); }} className="absolute top-5 right-5 text-2xl">×</button>
              <div className="mb-10">
                <div className="w-full h-2 bg-[#eee] rounded-full">
                  <div className="h-2 bg-[#2f2f2f] rounded-full transition-all duration-500" style={{ width: `${(step / 6) * 100}%` }} />
                </div>
              </div>

              {step === 0 && (
                <div>
                  <h3 className="text-3xl mb-10">Сможете присутствовать?</h3>
                  <div className="flex flex-col gap-5">
                    <button onClick={() => setAttendance("yes")} className={`p-5 rounded-2xl border ${attendance === "yes" ? "bg-black text-white" : ""}`}>С удовольствием приду</button>
                    <button onClick={() => setAttendance("no")} className={`p-5 rounded-2xl border ${attendance === "no" ? "bg-black text-white" : ""}`}>К сожалению не получится</button>
                  </div>
                  {attendance === "no" && (
                    <div className="space-y-4 mt-6">
                      <input
                        type="text"
                        placeholder="Ваше имя и фамилия *"
                        className="w-full border rounded-2xl p-5"
                        value={form.noName}
                        onChange={(e) => setForm({ ...form, noName: e.target.value })}
                      />
                      <input
                        type="email"
                        placeholder="Ваш email *"
                        className="w-full border rounded-2xl p-5"
                        value={form.noEmail}
                        onChange={(e) => setForm({ ...form, noEmail: e.target.value })}
                      />
                      <textarea
                        placeholder="Причина (если хотите)"
                        className="w-full border rounded-2xl p-5"
                        rows={3}
                        value={form.reason}
                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              )}

              {attendance === "yes" && step === 1 && (
                <div>
                  <h3 className="text-3xl mb-8">Укажите гостей</h3>
                  {form.guests.map((guest, idx) => (
                    <input key={idx} value={guest} onChange={(e) => { const updated = [...form.guests]; updated[idx] = e.target.value; setForm({ ...form, guests: updated }); }} placeholder="Имя и фамилия" className="w-full border rounded-2xl p-5 mb-4" />
                  ))}
                  <button onClick={() => setForm({ ...form, guests: [...form.guests, ""] })} className="underline">+ Добавить ещё гостя</button>
                </div>
              )}

              {attendance === "yes" && step === 2 && (
                <div>
                  <h3 className="text-3xl mb-8">Предпочтения по блюду</h3>
                  {["Мясо", "Рыба", "Птица", "Овощи и грибы"].map((item) => (
                    <button key={item} onClick={() => setForm({ ...form, food: item })} className={`w-full p-5 rounded-2xl border mb-4 ${form.food === item ? "bg-black text-white" : ""}`}>{item}</button>
                  ))}
                </div>
              )}

              {attendance === "yes" && step === 3 && (
                <div>
                  <h3 className="text-3xl mb-8">Предпочтения по алкоголю</h3>
                  {["Красное вино", "Белое вино", "Шампанское", "Виски", "Пиво", "Коктейли"].map((item) => (
                    <button key={item} onClick={() => toggleAlcohol(item)} className={`w-full p-5 rounded-2xl border mb-4 ${form.alcohol.includes(item) ? "bg-black text-white" : ""}`}>{item}</button>
                  ))}
                  <input placeholder="Другой вариант" className="w-full border rounded-2xl p-5 mt-4" value={form.customAlcohol} onChange={(e) => setForm({ ...form, customAlcohol: e.target.value })} />
                </div>
              )}

              {attendance === "yes" && step === 4 && (
                <div>
                  <h3 className="text-3xl mb-8">Нужен ли трансфер?</h3>
                  {["Да", "Нет"].map((item) => (
                    <button key={item} onClick={() => setForm({ ...form, transfer: item })} className={`w-full p-5 rounded-2xl border mb-4 ${form.transfer === item ? "bg-black text-white" : ""}`}>{item}</button>
                  ))}
                </div>
              )}

              {attendance === "yes" && step === 5 && (
                <div>
                  <h3 className="text-3xl mb-8">Нужна ли парковка?</h3>
                  {["Да", "Нет"].map((item) => (
                    <button key={item} onClick={() => setForm({ ...form, parking: item })} className={`w-full p-5 rounded-2xl border mb-4 ${form.parking === item ? "bg-black text-white" : ""}`}>{item}</button>
                  ))}
                  <textarea placeholder="Аллергии, пожелания или комментарии" className="w-full border rounded-2xl p-5 mt-5" rows={5} value={form.wishes} onChange={(e) => setForm({ ...form, wishes: e.target.value })} />
                </div>
              )}

              {attendance === "yes" && step === 6 && (
                <div>
                  <h3 className="text-3xl mb-8">Укажите email</h3>
                  <input type="email" placeholder="example@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-2xl p-5" />
                  <p className="text-sm text-[#777] mt-4">Email нужен для возможности изменения ответов позже</p>
                </div>
              )}

              <div className="flex justify-between mt-12">
                {step > 0 && <button onClick={() => setStep(step - 1)} className="px-6 py-3 border rounded-full">Назад</button>}
                {step < 6 && attendance !== "no" && (
                  <button disabled={!canContinue} onClick={() => setStep(step + 1)} className={`px-8 py-3 rounded-full ml-auto ${canContinue ? "bg-black text-white" : "bg-gray-300"}`}>Далее</button>
                )}
                {(step === 6 || attendance === "no") && (
                  <button disabled={!canContinue || loading} onClick={submitForm} className={`px-8 py-3 rounded-full ml-auto ${canContinue ? "bg-black text-white" : "bg-gray-300"}`}>Отправить</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
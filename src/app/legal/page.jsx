"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const sectionsData = {
  en: [
    {
      id: "terms",
      title: "Terms of Service",
      content: `
Last Updated: December 2024

1. ACCEPTANCE OF TERMS
By accessing or using Algotcha ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.

2. DESCRIPTION OF SERVICE
Algotcha provides analytical tools, simulation capabilities, and automated data processing through third-party data sources. The Service is provided "as is" without warranty of any kind.

3. ELIGIBILITY
You must be at least 18 years old and legally able to enter into contracts to use this Service. You are responsible for ensuring that your use of the Service complies with all applicable laws in your jurisdiction.

4. USER ACCOUNTS
- You are responsible for maintaining the confidentiality of your account credentials.
- You are responsible for all activities that occur under your account.
- You must notify us immediately of any unauthorized use of your account.

5. API KEYS AND DATA ACCESS
- You grant us permission to access data on your behalf using the API keys you provide.
- You must only provide API keys with read-only permissions.
- We are not responsible for losses resulting from compromised API keys.

6. ANALYTICAL RISKS
- Market analysis involves inherent uncertainties.
- Past performance of any model does not guarantee future results.
- You are solely responsible for your decisions based on our analysis.
- We do not provide financial, investment, or legal advice.

7. LIMITATION OF LIABILITY
Algotcha shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses.

8. MODIFICATIONS
We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.

9. TERMINATION
We may terminate or suspend your account at any time, with or without cause, with or without notice.

10. GOVERNING LAW
These terms shall be governed by the laws of Ukraine.
      `,
    },
    {
      id: "payment",
      title: "Payment and Delivery",
      content: `
Last Updated: December 2024

1. ACCEPTED PAYMENT METHODS
We accept payments through LiqPay payment system (operated by PrivatBank, Ukraine):
- Visa, Mastercard (Ukrainian and international)
- LiqPay account
- PrivatBank cards
- Other payment methods supported by LiqPay

2. PRICING AND CURRENCY
- All prices are listed in US Dollars (USD)
- Final amount charged may vary based on your bank's exchange rate
- Prices are inclusive of all applicable taxes

3. PAYMENT PROCESSING
- Payments are processed securely by LiqPay (www.liqpay.ua)
- We do not store your card details
- Payment confirmation is instant
- You will receive a payment receipt by email

4. SUBSCRIPTION BILLING
- Pro and Enterprise subscriptions are billed monthly or annually
- Billing occurs automatically on the renewal date
- You can cancel your subscription at any time
- Cancellation takes effect at the end of the current billing period

5. SERVICE DELIVERY
- Service is delivered digitally and instantly upon successful payment
- You will receive immediate access to your subscribed plan features
- No physical goods are shipped
- Access is provided through your online account at algotcha.com

6. FAILED PAYMENTS
- If a payment fails, we will notify you by email
- Your service may be suspended until payment is resolved
- You have 7 days to update your payment method
- After 7 days, your account may be downgraded to Free plan

7. REFUND POLICY
- 14-day money-back guarantee for all paid plans
- Refunds are processed within 3-5 business days
- Funds are returned via the same payment method
- See our Refund Policy page for full details

8. PRICE CHANGES
- We reserve the right to change our pricing
- Existing subscribers will be notified 30 days in advance
- Price changes do not affect current subscription period
- You may cancel before the new price takes effect

9. CONTACT FOR PAYMENT ISSUES
Email: support@algotcha.com
Phone: +38 (097) 768-57-24
Company: ТОВ "Алготча", Код: 46116338
      `,
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      content: `
Last Updated: December 2024

1. INFORMATION WE COLLECT
- Account Information: Email, name, and optional profile data.
- API Keys: Encrypted and stored securely.
- Usage Data: How you interact with the Service.
- Analysis Data: Models, simulations, and analysis history.

2. HOW WE USE YOUR INFORMATION
- To provide and maintain the Service.
- To process data on your behalf.
- To improve our products and services.
- To communicate with you about the Service.

3. DATA SECURITY
- All API keys are encrypted using industry-standard encryption.
- We use secure HTTPS connections for all data transmission.
- We never store API keys with write permissions.
- We regularly audit our security practices.

4. DATA SHARING
We do not sell your personal information. We may share data with:
- Service providers who assist in operating the Service.
- Law enforcement when required by law.

5. DATA RETENTION
We retain your data for as long as your account is active. You may request deletion of your data by contacting support.

6. YOUR RIGHTS (GDPR/CCPA)
You have the right to:
- Access your personal data.
- Correct inaccurate data.
- Delete your data.
- Export your data.
- Opt out of marketing communications.
- Withdraw consent at any time.

7. INTERNATIONAL DATA TRANSFERS
Your data may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place.

8. CONTACT
For privacy-related inquiries, contact us at support@algotcha.com.
      `,
    },
    {
      id: "cookies",
      title: "Cookie Policy",
      content: `
Last Updated: December 2024

1. WHAT ARE COOKIES?
Cookies are small text files stored on your device when you visit a website. They help us provide a better experience by remembering your preferences and analyzing how you use our Service.

2. TYPES OF COOKIES WE USE
Essential Cookies:
- Session management and authentication
- Security features
- Required for the Service to function

Analytics Cookies:
- Help us understand how visitors use our site
- Track page views and user behavior
- Improve our services based on usage data

Functional Cookies:
- Remember your language preference
- Store your settings and preferences
- Provide personalized features

3. HOW TO MANAGE COOKIES
You can control cookies through your browser settings:
- Block all cookies
- Delete existing cookies
- Allow only certain cookies

Note: Blocking essential cookies may prevent parts of the Service from functioning properly.

4. THIRD-PARTY COOKIES
We may use third-party services that set their own cookies:
- Google Analytics (analytics)
- Authentication providers

5. COOKIE CONSENT
When you first visit our site, you'll see a cookie banner. You can:
- Accept all cookies
- Accept only essential cookies
- Learn more about our cookie use

6. UPDATES TO THIS POLICY
We may update this policy to reflect changes in our practices. Check back periodically for updates.

7. CONTACT
For questions about our cookie use, contact support@algotcha.com.
      `,
    },
    {
      id: "risk",
      title: "Risk Disclosure",
      content: `
IMPORTANT RISK DISCLOSURE

Please read this carefully before using Algotcha.

ANALYTICAL RISK
Market analysis carries inherent uncertainties. The analytical models provided are for informational purposes only. Before making any decisions based on our analysis, you should carefully consider your objectives, level of experience, and risk tolerance.

NO GUARANTEE OF ACCURACY
There is no guarantee that the analysis provided by Algotcha will be accurate. Historical performance shown in simulations does not guarantee future results. Market conditions change, and models that worked in the past may not work in the future.

AUTOMATED ANALYSIS RISKS
- Technical failures may occur, resulting in delayed or incorrect analysis.
- Market conditions may change faster than models can adapt.
- Processing delays may impact timeliness of insights.
- Software bugs may cause unexpected behavior.

DATA SOURCE RISKS
- Data providers may experience downtime or errors.
- API rate limits may prevent timely data retrieval.
- Regulatory changes may affect access to data sources.

YOUR RESPONSIBILITY
- Only use analysis for informational purposes.
- Never rely solely on automated analysis for important decisions.
- Monitor your results regularly.
- Understand the models you are using.
- Keep your account credentials secure.

NOT FINANCIAL ADVICE
The information provided by Algotcha is for informational purposes only. It should not be considered as financial, investment, legal, or tax advice. Always consult with a qualified professional before making important decisions.

By using Algotcha, you acknowledge that you have read and understood this risk disclosure and accept full responsibility for your use of the analytical results.
      `,
    },
  ],
  uk: [
    {
      id: "terms",
      title: "Умови використання",
      content: `
Останнє оновлення: Грудень 2024

1. ПРИЙНЯТТЯ УМОВ
Отримуючи доступ до Algotcha ("Сервіс") або використовуючи його, ви погоджуєтесь дотримуватися цих Умов використання. Якщо ви не згодні з цими умовами, не використовуйте Сервіс.

2. ОПИС СЕРВІСУ
Algotcha надає аналітичні інструменти, можливості симуляції та автоматизовану обробку даних через сторонні джерела даних. Сервіс надається "як є" без будь-яких гарантій.

3. ПРАВО НА ВИКОРИСТАННЯ
Вам має бути не менше 18 років і ви повинні мати право укладати договори для використання цього Сервісу. Ви несете відповідальність за відповідність використання Сервісу всім застосовним законам вашої юрисдикції.

4. ОБЛІКОВІ ЗАПИСИ КОРИСТУВАЧІВ
- Ви відповідаєте за конфіденційність облікових даних.
- Ви відповідаєте за всі дії, що відбуваються під вашим обліковим записом.
- Ви повинні негайно повідомити нас про будь-яке несанкціоноване використання.

5. API КЛЮЧІ ТА ДОСТУП ДО ДАНИХ
- Ви надаєте нам дозвіл на доступ до даних від вашого імені за допомогою наданих вами API ключів.
- Ви повинні надавати API ключі лише з правами на читання.
- Ми не несемо відповідальності за втрати від скомпрометованих API ключів.

6. АНАЛІТИЧНІ РИЗИКИ
- Аналіз ринку несе невизначеності.
- Минулі результати моделі не гарантують майбутніх результатів.
- Ви несете повну відповідальність за свої рішення на основі нашого аналізу.
- Ми не надаємо фінансових, інвестиційних або юридичних порад.

7. ОБМЕЖЕННЯ ВІДПОВІДАЛЬНОСТІ
Algotcha не несе відповідальності за будь-які непрямі, випадкові, особливі, наслідкові або штрафні збитки, включаючи втрату прибутку, даних або інших нематеріальних втрат.

8. ЗМІНИ
Ми залишаємо за собою право змінювати ці умови в будь-який час. Продовження використання Сервісу після змін означає прийняття нових умов.

9. ПРИПИНЕННЯ
Ми можемо припинити або призупинити ваш обліковий запис у будь-який час, з причиною або без неї, з повідомленням або без нього.

10. ЗАСТОСОВНЕ ПРАВО
Ці умови регулюються законодавством України.
      `,
    },
    {
      id: "payment",
      title: "Оплата та доставка",
      content: `
Останнє оновлення: Грудень 2024

1. ПРИЙНЯТНІ СПОСОБИ ОПЛАТИ
Ми приймаємо платежі через платіжну систему LiqPay (під керівництвом ПриватБанку, Україна):
- Visa, Mastercard (українські та міжнародні)
- Обліковий запис LiqPay
- Картки ПриватБанку
- Інші способи оплати, підтримувані LiqPay

2. ЦІНОУТВОРЕННЯ ТА ВАЛЮТА
- Всі ціни вказані в доларах США (USD)
- Остаточна сума може відрізнятися залежно від курсу обміну вашого банку
- Ціни включають усі застосовні податки

3. ОБРОБКА ПЛАТЕЖІВ
- Платежі обробляються безпечно через LiqPay (www.liqpay.ua)
- Ми не зберігаємо дані вашої картки
- Підтвердження платежу миттєве
- Ви отримаєте квитанцію на електронну пошту

4. РАХУНКИ ЗА ПІДПИСКУ
- Підписки Pro та Enterprise виставляються щомісяця або щорічно
- Оплата відбувається автоматично на дату продовження
- Ви можете скасувати підписку в будь-який час
- Скасування набуває чинності наприкінці поточного платіжного періоду

5. ДОСТАВКА ПОСЛУГИ
- Послуга надається цифрово та миттєво після успішної оплати
- Ви отримаєте негайний доступ до функцій вашого плану
- Фізичні товари не доставляються
- Доступ надається через ваш обліковий запис на algotcha.com

6. НЕВДАЛІ ПЛАТЕЖІ
- Якщо платіж не пройде, ми повідомимо вас електронною поштою
- Вашу послугу може бути призупинено до вирішення проблеми з оплатою
- У вас є 7 днів для оновлення способу оплати
- Після 7 днів ваш обліковий запис може бути переведено на безкоштовний план

7. ПОЛІТИКА ПОВЕРНЕННЯ КОШТІВ
- 14-денна гарантія повернення грошей для всіх платних планів
- Повернення коштів обробляється протягом 3-5 робочих днів
- Кошти повертаються тим же способом оплати
- Повна інформація на сторінці Політики повернення коштів

8. ЗМІНА ЦІН
- Ми залишаємо за собою право змінювати ціни
- Існуючі підписники будуть повідомлені за 30 днів
- Зміни цін не впливають на поточний платіжний період
- Ви можете скасувати до набуття чинності новою ціною

9. КОНТАКТИ З ПИТАНЬ ОПЛАТИ
Email: support@algotcha.com
Телефон: +38 (097) 768-57-24
Компанія: ТОВ "Алготча", Код: 46116338
      `,
    },
    {
      id: "privacy",
      title: "Політика конфіденційності",
      content: `
Останнє оновлення: Грудень 2024

1. ІНФОРМАЦІЯ, ЯКУ МИ ЗБИРАЄМО
- Інформація облікового запису: Email, ім'я та додаткові дані профілю.
- API ключі: Зашифровані та зберігаються безпечно.
- Дані використання: Як ви взаємодієте з Сервісом.
- Дані аналізу: Моделі, симуляції та історія аналізу.

2. ЯК МИ ВИКОРИСТОВУЄМО ВАШУ ІНФОРМАЦІЮ
- Для надання та підтримки Сервісу.
- Для обробки даних від вашого імені.
- Для покращення наших продуктів та послуг.
- Для спілкування з вами щодо Сервісу.

3. БЕЗПЕКА ДАНИХ
- Всі API ключі зашифровані за допомогою стандартного шифрування.
- Ми використовуємо безпечні HTTPS з'єднання для всіх передач даних.
- Ми ніколи не зберігаємо API ключі з правами на запис.
- Ми регулярно перевіряємо наші практики безпеки.

4. ПЕРЕДАЧА ДАНИХ
Ми не продаємо вашу особисту інформацію. Ми можемо передавати дані:
- Постачальникам послуг, які допомагають в роботі Сервісу.
- Правоохоронним органам за вимогою закону.

5. ЗБЕРІГАННЯ ДАНИХ
Ми зберігаємо ваші дані, поки ваш обліковий запис активний. Ви можете запросити видалення даних, звернувшись до підтримки.

6. ВАШІ ПРАВА (GDPR/CCPA)
Ви маєте право:
- Отримати доступ до своїх персональних даних.
- Виправити неточні дані.
- Видалити свої дані.
- Експортувати свої дані.
- Відмовитися від маркетингових комунікацій.
- Відкликати згоду в будь-який час.

7. МІЖНАРОДНА ПЕРЕДАЧА ДАНИХ
Ваші дані можуть бути передані та оброблені в країнах за межами вашого проживання. Ми забезпечуємо відповідні гарантії.

8. КОНТАКТИ
Для запитів щодо конфіденційності зв'яжіться з нами за адресою support@algotcha.com.
      `,
    },
    {
      id: "cookies",
      title: "Політика Cookie",
      content: `
Останнє оновлення: Грудень 2024

1. ЩО ТАКЕ COOKIES?
Cookies — це невеликі текстові файли, які зберігаються на вашому пристрої при відвідуванні веб-сайту. Вони допомагають нам забезпечити кращий досвід, запам'ятовуючи ваші налаштування та аналізуючи використання Сервісу.

2. ТИПИ COOKIES, ЯКІ МИ ВИКОРИСТОВУЄМО
Необхідні Cookies:
- Управління сесіями та автентифікація
- Функції безпеки
- Необхідні для роботи Сервісу

Аналітичні Cookies:
- Допомагають зрозуміти, як відвідувачі використовують сайт
- Відстежують перегляди сторінок та поведінку користувачів
- Покращують наші послуги на основі даних використання

Функціональні Cookies:
- Запам'ятовують вашу мову
- Зберігають ваші налаштування
- Надають персоналізовані функції

3. ЯК КЕРУВАТИ COOKIES
Ви можете контролювати cookies через налаштування браузера:
- Блокувати всі cookies
- Видалити існуючі cookies
- Дозволити лише певні cookies

Примітка: Блокування необхідних cookies може завадити роботі частин Сервісу.

4. COOKIES ТРЕТІХ СТОРІН
Ми можемо використовувати сторонні сервіси, які встановлюють власні cookies:
- Google Analytics (аналітика)
- Провайдери автентифікації

5. ЗГОДА НА COOKIES
При першому відвідуванні сайту ви побачите банер cookies. Ви можете:
- Прийняти всі cookies
- Прийняти лише необхідні cookies
- Дізнатися більше про використання cookies

6. ОНОВЛЕННЯ ЦІЄЇ ПОЛІТИКИ
Ми можемо оновлювати цю політику для відображення змін у наших практиках. Періодично перевіряйте оновлення.

7. КОНТАКТИ
Для запитань щодо cookies зв'яжіться з support@algotcha.com.
      `,
    },
    {
      id: "risk",
      title: "Розкриття ризиків",
      content: `
ВАЖЛИВЕ РОЗКРИТТЯ РИЗИКІВ

Будь ласка, уважно прочитайте перед використанням Algotcha.

АНАЛІТИЧНИЙ РИЗИК
Аналіз ринку несе невизначеності. Аналітичні моделі надаються лише для інформаційних цілей. Перед прийняттям будь-яких рішень на основі нашого аналізу ви повинні ретельно розглянути свої цілі, рівень досвіду та толерантність до ризику.

ВІДСУТНІСТЬ ГАРАНТІЇ ТОЧНОСТІ
Немає гарантії, що аналіз, наданий Algotcha, буде точним. Історичні результати симуляцій не гарантують майбутніх результатів. Ринкові умови змінюються, і моделі, які працювали в минулому, можуть не працювати в майбутньому.

РИЗИКИ АВТОМАТИЗОВАНОГО АНАЛІЗУ
- Можуть виникати технічні збої, що призводять до затриманого або неправильного аналізу.
- Ринкові умови можуть змінюватися швидше, ніж моделі можуть адаптуватися.
- Затримки обробки можуть вплинути на своєчасність інсайтів.
- Програмні баги можуть спричинити несподівану поведінку.

РИЗИКИ ДЖЕРЕЛ ДАНИХ
- Постачальники даних можуть зазнавати простоїв або помилок.
- Ліміти API можуть перешкоджати своєчасному отриманню даних.
- Регуляторні зміни можуть вплинути на доступ до джерел даних.

ВАША ВІДПОВІДАЛЬНІСТЬ
- Використовуйте аналіз лише для інформаційних цілей.
- Ніколи не покладайтеся виключно на автоматизований аналіз для важливих рішень.
- Регулярно моніторте свої результати.
- Розумійте моделі, які використовуєте.
- Тримайте облікові дані в безпеці.

НЕ ФІНАНСОВА ПОРАДА
Інформація, надана Algotcha, призначена лише для інформаційних цілей. Її не слід розглядати як фінансову, інвестиційну, юридичну або податкову пораду. Завжди консультуйтеся з кваліфікованим фахівцем перед прийняттям важливих рішень.

Використовуючи Algotcha, ви підтверджуєте, що прочитали та зрозуміли це розкриття ризиків і приймаєте повну відповідальність за використання аналітичних результатів.
      `,
    },
  ],
};

export default function LegalPage() {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState("terms");
  const sections = sectionsData[language] || sectionsData.en;

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sections.find((s) => s.id === hash)) {
      setActiveSection(hash);
    }
  }, [sections]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">
          {language === "uk" ? "Правова інформація" : "Legal"}
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4 sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      window.history.replaceState(null, "", `#${section.id}`);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    aria-current={activeSection === section.id ? "page" : undefined}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className={activeSection === section.id ? "block" : "hidden"}
              >
                <div className="bg-white rounded-xl border p-8">
                  <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                  <div className="prose prose-gray max-w-none">
                    {section.content.split("\n").map((paragraph, i) => {
                      if (paragraph.trim().match(/^\d+\./)) {
                        return (
                          <h3 key={i} className="font-semibold mt-6 mb-2 text-gray-900">
                            {paragraph.trim()}
                          </h3>
                        );
                      }
                      if (paragraph.trim().startsWith("-")) {
                        return (
                          <li key={i} className="text-gray-600 ml-4">
                            {paragraph.trim().substring(1).trim()}
                          </li>
                        );
                      }
                      if (paragraph.trim()) {
                        return (
                          <p key={i} className="text-gray-600 mb-3">
                            {paragraph.trim()}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const sections = [
  {
    id: "terms",
    title: "Terms of Service",
    content: `
Last Updated: December 2024

1. ACCEPTANCE OF TERMS
By accessing or using Algotcha ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.

2. DESCRIPTION OF SERVICE
Algotcha provides algorithmic trading tools, backtesting capabilities, and automated trading execution through third-party exchanges. The Service is provided "as is" without warranty of any kind.

3. ELIGIBILITY
You must be at least 18 years old and legally able to enter into contracts to use this Service. You are responsible for ensuring that your use of the Service complies with all applicable laws in your jurisdiction.

4. USER ACCOUNTS
- You are responsible for maintaining the confidentiality of your account credentials.
- You are responsible for all activities that occur under your account.
- You must notify us immediately of any unauthorized use of your account.

5. API KEYS AND EXCHANGE ACCESS
- You grant us permission to execute trades on your behalf using the API keys you provide.
- You must only provide API keys with trading permissions (never withdrawal permissions).
- We are not responsible for losses resulting from compromised API keys.

6. TRADING RISKS
- Trading cryptocurrencies involves significant risk of loss.
- Past performance of any strategy does not guarantee future results.
- You are solely responsible for your trading decisions.
- We do not provide financial, investment, or legal advice.

7. LIMITATION OF LIABILITY
Algotcha shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses.

8. MODIFICATIONS
We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.

9. TERMINATION
We may terminate or suspend your account at any time, with or without cause, with or without notice.

10. GOVERNING LAW
These terms shall be governed by the laws of the jurisdiction in which our company is registered.
    `,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    content: `
Last Updated: December 2024

1. INFORMATION WE COLLECT
- Account Information: Email, name, and optional profile data.
- Exchange API Keys: Encrypted and stored securely.
- Usage Data: How you interact with the Service.
- Trading Data: Strategies, backtests, and trade history.

2. HOW WE USE YOUR INFORMATION
- To provide and maintain the Service.
- To execute trades on your behalf.
- To improve our products and services.
- To communicate with you about the Service.

3. DATA SECURITY
- All API keys are encrypted using industry-standard encryption.
- We use secure HTTPS connections for all data transmission.
- We never store withdrawal-enabled API keys.
- We regularly audit our security practices.

4. DATA SHARING
We do not sell your personal information. We may share data with:
- Service providers who assist in operating the Service.
- Law enforcement when required by law.

5. DATA RETENTION
We retain your data for as long as your account is active. You may request deletion of your data by contacting support.

6. YOUR RIGHTS
You have the right to:
- Access your personal data.
- Correct inaccurate data.
- Delete your data.
- Export your data.

7. COOKIES
We use cookies to maintain session state and improve user experience. You can disable cookies in your browser settings.

8. CONTACT
For privacy-related inquiries, contact us at support@algotcha.com.
    `,
  },
  {
    id: "risk",
    title: "Risk Disclosure",
    content: `
IMPORTANT RISK DISCLOSURE

Please read this carefully before using Algotcha.

TRADING RISK
Cryptocurrency trading carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade cryptocurrencies, you should carefully consider your investment objectives, level of experience, and risk appetite.

NO GUARANTEE OF PROFIT
There is no guarantee that you will make money using Algotcha. Historical performance shown in backtests does not guarantee future results. Market conditions change, and strategies that worked in the past may not work in the future.

ALGORITHMIC TRADING RISKS
- Technical failures may occur, resulting in missed trades or erroneous orders.
- Market conditions may change faster than algorithms can adapt.
- Slippage and execution delays may impact performance.
- Software bugs may cause unexpected behavior.

EXCHANGE RISKS
- Exchanges may experience downtime, hacks, or insolvency.
- API rate limits may prevent timely trade execution.
- Regulatory changes may affect access to exchanges.

YOUR RESPONSIBILITY
- Only trade with money you can afford to lose.
- Never enable withdrawal permissions on API keys.
- Monitor your positions regularly.
- Understand the strategies you are using.
- Keep your account credentials secure.

NOT FINANCIAL ADVICE
The information provided by Algotcha is for informational purposes only. It should not be considered as financial, investment, legal, or tax advice. Always consult with a qualified professional before making investment decisions.

By using Algotcha, you acknowledge that you have read and understood this risk disclosure and accept full responsibility for your trading activities.
    `,
  },
];

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState("terms");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Legal</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4 sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
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

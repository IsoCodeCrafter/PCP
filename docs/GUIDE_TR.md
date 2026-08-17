# 📖 Yapay Zeka ile Geliştirme Yapanlar İçin PCP Rehberi: "Projenizin Canlı Hafızası"

> **PCP (Project Context Protocol)** nedir, ne işe yarar, neden kullanılmalıdır ve 5 dakikada nasıl başlanır?

---

## 💡 Hikaye: Hepimizin Yaşadığı O Büyük Problem

Yapay zeka asistanlarını (Cursor, Claude Desktop, ChatGPT, Windsurf, Antigravity, Copilot) kullanarak harika bir proje geliştiriyorsunuz. İlk günler her şey harika gidiyor. 

Ancak birkaç gün sonra yeni bir sohbet penceresi açtığınızda şunlar yaşanıyor:
* Yapay zeka, 2 gün önce neden **MongoDB yerine PostgreSQL** seçtiğinizi tamamen unutmuş.
* Daha önce "Bu projede sakın şu kütüphaneyi kullanma" dediğiniz kuralı hatırlamıyor ve çalışan kodunuzu bozuyor.
* Projeye sıfırdan başlar gibi uzun uzun projenizi, mimarinizi ve kurallarınızı yeniden anlatmak (prompt yazmak) zorunda kalıyorsunuz.
* Ekibe yeni bir insan arkadaşınız katıldığında da aynı şey: *"Nereden başlayacağım, neyi neden yaptık?"*

İşte bu duruma yazılım dünyasında **"Bağlam Kaybı" (Context Rot / Drift)** denir.

---

## 1. PCP Ne Yapıyor?

**PCP (Project Context Protocol)**, projenizin **"ortak hafıza kutusudur"**.

PCP, bir projeye bakan bir **insanın**, bir **yapay zekanın** veya bir **otomasyon aracının** projeyi tam olarak aynı şekilde anlamasını, geçmişte alınan kararları bilmesini ve projenin geleceğine doğru adımlarla devam etmesini sağlayan **açık bir protokoldür**.

> 🎯 **Temel İlke:** *"Zekayı değil, bağlamı standartlaştır."*  
> *(Hangi yapay zeka modelini veya aracını kullanırsanız kullanın, projenizin hafızası hep sabit, taşınabilir ve sağlam kalsın.)*

---

## 2. Nasıl Yapıyor?

PCP, projenizin içine `context/` adında küçük, düzenli ve tertemiz bir klasör yerleştirir. Bu klasörün içinde 5 temel bileşen ve 1 harita bulunur:

```text
context/
├── manifest.yaml          🗺️ Harita: Projenin kimliği ve bileşen listesi
├── ARCHITECTURE.md        🏗️ Mimari: Proje nasıl kuruldu, hangi parça ne işe yarar?
├── DECISION_LOG.md        ⚖️ Kararlar: Neden X teknolojisini seçtik, alternatifler neydi?
├── KNOWLEDGE.md           🧠 Kurallar: Projenin asla çiğnenmemesi gereken kuralları
├── OPEN_WORK.md           📋 Yapılacaklar: Sırada ne var, yarım kalan işler neler?
└── OPERATIONAL_GUIDE.md   🛠️ Kılavuz: Proje nasıl çalıştırılır, nasıl test edilir?
```

### 🪄 Sihirli Dokunuş: "Hibrit Format"
Bu belgeler hem **bir insanın rahatça okuyabileceği sade Markdown** formatındadır, hem de başlarındaki küçük meta-etiketler (**YAML Frontmatter**) sayesinde **yapay zekalar ve test araçları (CLI Linter) tarafından hatasız şekilde doğrulanabilir**.

---

## 3. Ne İşe Yarayacak?

* **Model Bağımsızlığı:** Bugün GPT-4 ile geliştirip yarın Claude 3.7'ye veya başka bir modele geçseniz bile bağlamınız kaybolmaz.
* **Sohbet Yorgunluğundan Kurtulma:** Her yeni sohbette yapay zekaya 10 paragraf açıklama yazmazsınız; AI doğrudan `context/` klasörünü okur ve projenin uzmanı gibi davranır.
* **Proje Sürekliliği (Continuity):** Projeye 3 ay ara verip geri döndüğünüzde, "Ben burada ne yapıyordum?" demezsiniz. Her şey yerli yerindedir.

---

## 4. Neden Kullanılmalı? Avantajları Neler?

| Avantaj | Size Ne Kazandırır? |
| :--- | :--- |
| 🛡️ **Kodu Bozmayan AI** | AI projenizin mimarisini bildiği için kafasına göre sistemi altüst eden kodlar yazmaz. |
| ⚡ **Zaman & Token Tasarrufu** | Her gün aynı şeyleri yapay zekaya tekrar tekrar anlatarak harcadığınız token ve vakit cebinizde kalır. |
| 🔍 **Otomatik Denetim (Linter)** | Tek bir komutla (`pcp check`), projenizin hafızasında eksik veya kırık bir karar olup olmadığını 1 saniyede test edersiniz. |
| 🤝 **İnsan & AI Uyumu** | İnsan geliştirici ile AI asistanı aynı tek gerçeklik kaynağından (**Single Source of Truth**) beslenir. |

---

## 5. Benzer Şeyler Yok muydu? PCP'nin Farkı Ne?

| Çözüm | Neden Yetersiz Kalıyor? | PCP'nin Farkı |
| :--- | :--- | :--- |
| **README.md** | Sadece yüzeysel vitrindir; geçmiş kararları, mimari kısıtları ve AI kurallarını yönetemez. | 6 zorunlu derinlik bileşeni sunar. |
| **Notion / Jira / Linear** | Kod deposunun dışındadır; AI kod yazarken Notion'a bağlanamaz. | Doğrudan Git deposunun içinde yaşar. |
| **.cursorrules** | Sadece Cursor'a özeldir; Claude Desktop'a geçince çalışmaz, test edilemez. | Tüm IDE ve AI modellerinde geçerli açık standarttır. |
| **MCP (Model Context Protocol)** | MCP bir **köprüdür** (veri taşıma borusudur). | PCP ise o borunun içinden akan standart **"bağlam suyunun"** kendisidir. |

---

## 6. Nasıl Kullanılır? (4 Adımda Hızlı Başlangıç)

### 1. Adım: Projenize Ekleyin (1 Saniye)
Terminalinizde projenizin klasörüne gidin ve şunu çalıştırın:
```bash
npx pcp-cli init --name "Harika Uygulamam"
```
*(Projenizde anında standart `context/` yapısı kurulur.)*

---

### 2. Adım: Yapay Zekanıza Bağlayın (Cursor / Claude / Antigravity)
Kullandığınız AI editörünün MCP ayarlarına şu satırları ekleyin:
```json
{
  "mcpServers": {
    "pcp": {
      "command": "npx",
      "args": ["-y", "pcp-cli", "mcp"]
    }
  }
}
```

---

### 3. Adım: Yapay Zeka ile Birlikte Yaşatın
Artık yapay zekaya sadece şunu söylemeniz yeterlidir:
> *"PCP bağlamına bakarak bana yeni bir kullanıcı giriş sistemi tasarla ve aldığımız kararı bana onaylatarak kaydet."*

Yapay zeka doğrudan `KNOWLEDGE.md` ve `ARCHITECTURE.md` dosyalarını okur, kurallara uygun kodu yazar ve yeni kararı (`DEC-0003`) standart formatta hazırlayıp sizin onayınıza sunar.

---

### 4. Adım: Sağlamlığını Test Edin (Linter)
İstediğiniz zaman terminalden tek bir komutla bağlamınızı doğrulayın:
```bash
npx pcp-cli check
```
*(Eğer her şey kuralına uygunsa yeşil bir **`✔ All PCP checks PASSED`** onayı alırsınız!)*

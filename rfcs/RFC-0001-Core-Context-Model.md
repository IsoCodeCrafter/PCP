# RFC-0001: Canonical Entry Point and Structured Metadata Model

* **RFC Number:** 0001
* **Title:** Canonical Entry Point and Structured Metadata Model
* **Status:** Accepted
* **Author(s):** PCP Core Contributors
* **Created:** 2026-08-17
* **Accepted:** 2026-08-17
* **Target Version:** PCP Specification v0.1 / Reference Implementation Level 2

---

## 1. Summary

Bu RFC, PCP (Project Context Protocol) standartlarında iki temel yapısal boşluğu gidermeyi önerir:
1. **Canonical Entry Point (Giriş Noktası):** İnsan geliştiricilerin, CLI araçlarının ve AI ajanlarının bir depodaki Project Context'i deterministik olarak bulabilmesi için standart bir giriş noktası (`manifest.yaml` / `context/manifest.yaml`) tanımlanması.
2. **Yapılandırılmış Üstveri Şeması (Structured Metadata Model):** Serbest Markdown metinlerinin içine makine tarafından doğrulanabilir (machine-verifiable) standart **YAML Frontmatter** bloklarının dahil edilmesi.

---

## 2. Motivation (Gerekçe & Problem Tanımı)

PCP Specification v0.1 taslağı, kavramsal düzeyde 4 ana sütun (*Project, Project Context, Contributor, Project Continuity*) ve 6 çekirdek bileşen (*Decisions, Knowledge, State, Open Work, Architecture, Operational Guide*) tanımlamıştır.

Ancak pratik uygulamada şu iki temel sorun ortaya çıkmaktadır:

### Problem A: "Nereden Başlayacağım?" (Keşif Belirsizliği)
Projeye yeni bağlanan bir AI ajanı veya otomasyon aracı (CLI, Linter), bağlamın nerede başladığını, hangi bileşenlerin mevcut olduğunu, hangi dosyanın hangi sorumluluğu üstlendiğini otomatik olarak tespit edememektedir. Dizin isimlerine dayalı örtük (implicit) varsayımlar kırılgandır.

### Problem B: Doğrulanamayan Serbest Metin (Verification & Drift)
Tamamen serbest Markdown metinleri kullanıldığında:
* Bir kararın (`DEC-0001`) geçerlilik durumu (`status`), tarihi veya bağımlılıkları araçlar tarafından güvenilir şekilde parse edilemez.
* Kırık referanslar (örneğin var olmayan bir `ARCH-0005`'e atıfta bulunulması) otomatik test edilemez.
* Linter ve Validator araçları deterministik çalışamaz.

---

## 3. Conceptual Impact (Kavramsal Modele Etkisi)

Bu öneri **yeni bir çekirdek kavram yaratmaz**, ancak mevcut `Project Context` kavramının iç organizasyonunu netleştirir:

* `Project Context` bünyesinde bir **Manifest (Index / Entry Point)** bileşeni yer alır.
* Bu bileşen, diğer 6 zorunlu bileşenin meta-verilerini, dosya konumlarını ve protokol uyumluluk versiyonunu barındıran "Harita" (Map) görevi görür.
* Şartnamenin *Teknolojiden Bağımsızlık* ilkesi korunur: Markdown referans uygulamasında YAML Frontmatter kullanılırken, bir JSON veya Veritabanı uygulamasında karşılık gelen alanlar aynı anlamsal (semantic) eşdeğerliği korur.

---

## 4. Detailed Specification (Detaylı Tasarım)

### 4.1. Canonical Entry Point: `manifest.yaml`

Referans uygulamada, bağlam dizini altında (`context/manifest.yaml`) standart bir giriş manifestosu tanımlanır:

```yaml
# PCP Context Manifest
pcp_version: "0.1"
schema_version: "1.0"

project:
  id: "pcp-standard"
  name: "Project Context Protocol"
  description: "Standardize Context, Not Intelligence"
  created_at: "2026-08-05"

components:
  architecture:
    path: "ARCHITECTURE.md"
    status: "active"
  decisions:
    path: "DECISION_LOG.md"
    count: 1
  knowledge:
    path: "KNOWLEDGE.md"
    count: 1
  open_work:
    path: "OPEN_WORK.md"
    active_items: 3
  operational_guide:
    path: "OPERATIONAL_GUIDE.md"
    status: "active"
```

### 4.2. Yapılandırılmış Metadata Şeması (YAML Frontmatter)

Her Markdown context belgesi, serbest metin gövdesinden önce standart bir YAML Frontmatter başlığı içerir.

#### A. Genel Başlık Şablonu (Common Header)
Tüm PCP bileşenlerinde zorunlu olan temel alanlar:
```yaml
---
id: string          # Tekil kimlik (Örn: DEC-0001, ARCH-0001, KN-0001, WORK-0001)
title: string       # Kısa ve açıklayıcı başlık
status: string      # active | proposed | accepted | deprecated | superseded | completed
created_at: string  # ISO-8601 (YYYY-MM-DD)
updated_at: string  # ISO-8601 (YYYY-MM-DD)
tags: [string]      # Kategorizasyon etiketleri
dependencies: [string] # İlgili diğer ID referansları
---
```

#### B. Bileşene Özel Ek Alanlar (Component-Specific Fields)

* **Decision Log (`DEC-xxxx`):**
  ```yaml
  ---
  id: "DEC-0001"
  title: "Adopt Markdown as the Reference Implementation Format"
  status: "accepted"
  date: "2026-08-05"
  contributors: ["Human", "AI Assistant"]
  supersedes: null
  tags: ["storage", "reference"]
  dependencies: ["ARCH-0001"]
  ---
  ```

* **Open Work (`WORK-xxxx`):**
  ```yaml
  ---
  id: "WORK-0001"
  title: "Define Compliance Levels"
  status: "open"
  priority: "high"
  owner: "unassigned"
  target_version: "PCP 1.0"
  dependencies: ["SPEC-0008"]
  ---
  ```

* **Knowledge (`KN-xxxx`):**
  ```yaml
  ---
  id: "KN-0001"
  title: "Project Context Is Technology Independent"
  category: "architecture"
  source: "PCP Specification"
  tags: ["principles", "compliance"]
  ---
  ```

---

## 5. Tooling & Validation Lifecycle (CLI & Linter Uyumu)

Bu şemanın kabul edilmesiyle Faz 2'deki `pcp-cli` şu kontrolleri deterministik (0 hata payı ile) yapabilir:

1. **Existence Check:** `manifest.yaml` dosyası ve referans verdiği tüm dosyalar mevcut mu?
2. **Schema Validity:** Frontmatter alanları doğru tiplerde mi (ISO tarih, geçerli status enum değerleri vb.)?
3. **Reference Integrity:** `dependencies` içinde yazılan `DEC-0002` veya `ARCH-0001` gerçekten mevcut mu, yoksa yetim (dangling) referans mı?
4. **Lifecycle Consistency:** `superseded` durumundaki bir kararın `superseded_by` referansı var mı?

---

## 6. Alternatives Considered (Değerlendirilen Alternatifler)

| Alternatif | Değerlendirme | Sonuç |
| :--- | :--- | :--- |
| **1. Tamamen Serbest Markdown** | Regex tabanlı parse etme kırılgandır, AI modelleri başlık formatlarını bozabilir. | ❌ Reddedildi |
| **2. Saf JSON / YAML (Markdown Yok)** | İnsan geliştirici için Git diff okuması ve zengin dokümantasyon yazımı zorlaşır. | ❌ Reddedildi |
| **3. Hibrit Model (YAML Frontmatter + Markdown)** | Hem insan için mükemmel okunabilirlik hem de CLI/AI için katı veri şeması sunar. | ✅ **Seçildi** |

---

## 7. Security & Human-in-the-Loop Considerations

* Metadata alanlarında yürütülebilir kod (script execution / eval) yer alamaz.
* AI ajanları bağlam güncellerken doğrudan dosya yazmak yerine, bu şemaya uygun bir `PCP Change Proposal` önermeli ve insan onayı sonrası kayıt düşmelidir.

---

## 8. Resolved Decisions (Karara Bağlanan Maddeler)

1. **Manifest Konumu:** Canonical konum `context/manifest.yaml` olarak belirlenmiştir. Bu sayede bağlam dizini repo içerisinde izole, taşınabilir ve modüler kalır.
2. **Çoklu Context:** İlk aşamada tekil context (`context/`) desteklenecek, monorepo alt-modülleri için çoklu context ileriki RFC'lerde ele alınacaktır.


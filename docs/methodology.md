# Technical Methodology & Analytical Architecture

## 1. Project Background & Business Intent

**ABC Institute** offers professional training programs covering multimedia, design, animation, and computing (e.g., DaVinci Resolve, Adobe After Effects, Autodesk 3ds Max, DCA, MS Excel). 

To optimize commercial operations, academic completion, and marketing ROI, the institute leadership required an executive-grade business intelligence solution. The primary objectives are:
- **Financial Monitoring**: Track aggregate revenue, fee distributions across courses, and revenue growth trajectory.
- **Academic Throughput**: Quantify completion effectiveness through verified certification issuance rates.
- **Demographic Targeting**: Identify key age brackets driving enrollments to optimize ad spend.
- **Seasonality Profiling**: Pinpoint high-inflow and low-inflow intake months to balance cohort capacity and instructor allocation.

---

## 2. Data Modeling & Architecture

The report implements a relational schema connecting student demographics with course enrollment transactions:

```
+------------------------------------+          +------------------------------------+
|          Personal Details          |          |      Student Course Details (2)    |
+------------------------------------+          +------------------------------------+
| [PK] Student Name                  |<-------->| [FK] Student Name                  |
| City                               |          | Course                             |
| Issued Certificate ("Yes" / "No")  |          | Fees                               |
+------------------------------------+          | Age                                |
                                                | Age Group                          |
                                                | Date of Join                       |
                                                | Month                              |
                                                +------------------------------------+
```

### Table Definitions
1. **`Personal Details`**:
   - `Student Name`: Unique student identifier.
   - `City`: Student geographic location (used in location-based slicers).
   - `Issued Certificate`: Binary completion flag (`Yes`/`No`) indicating whether the student met graduation requirements.
2. **`Student Course Details (2)`**:
   - `Student Name`: Foreign key linking to personal records.
   - `Course`: Enrolled course curriculum.
   - `Fees`: Course tuition fee in INR (₹).
   - `Age`: Numerical age of the student.
   - `Age Group`: Calculated demographic bucket (`20-29`, `30-39`, `Above 40`, `Below 20`).
   - `Date of Join`: Enrollment timestamp.
   - `Month`: Calendar month derived for time-series analysis.

---

## 3. Data Cleansing & Transformation (Power Query)

1. **Type Specification & Schema Validation**:
   - Explicitly cast `Fees` to Fixed Decimal / Currency.
   - Formatted `Date of Join` as Date and established standard date hierarchies (Year, Month).
   - Cleaned string whitespace on `Course` titles and `City` names.
2. **Demographic Grouping**:
   - Applied conditional grouping to partition continuous `Age` into standard statistical cohorts:
     - `Below 20`: Secondary school / early starters.
     - `20-29`: Primary university students & early-career upskillers.
     - `30-39`: Mid-career career switchers.
     - `Above 40`: Senior learners / hobbyists.
3. **Certification Integrity**:
   - Standardized `Issued Certificate` responses to boolean-equivalent representations.

---

## 4. DAX Measures & Analytical Formulation

The dashboard leverages explicit DAX measures across multiple dimensional contexts:

### Core Financial Measures
- **Total Revenue**:
  ```dax
  Total Revenue = SUM('Student Course Details (2)'[Fees])
  ```
  *Current Value: ₹6,877,500 (~₹6.88M)*

- **Average Fee**:
  ```dax
  Average Fee = AVERAGE('Student Course Details (2)'[Fees])
  ```
  *Current Value: ₹8,909*

- **Revenue Growth % (YoY)**:
  ```dax
  Revenue Growth % = 
  VAR CurrentYearRev = [Total Revenue]
  VAR PriorYearRev = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Student Course Details (2)'[Date of Join]))
  RETURN
      DIVIDE(CurrentYearRev - PriorYearRev, PriorYearRev, 0)
  ```
  *Current Value: +18.4% YoY*

### Academic & Student Measures
- **Total Students**:
  ```dax
  Total Students = DISTINCTCOUNT('Student Course Details (2)'[Student Name])
  ```
  *Current Value: 772 students*

- **Certificates Issued**:
  ```dax
  Certificates Issued = 
  CALCULATE(
      COUNTROWS('Personal Details'),
      'Personal Details'[Issued Certificate] = "Yes"
  )
  ```
  *Current Value: 504 certificates*

- **Certificate Completion Rate %**:
  ```dax
  Certificate Completion Rate = 
  DIVIDE([Certificates Issued], [Total Students], 0)
  ```
  *Current Value: 65.28%*

- **Student Growth % (YoY)**:
  *Current Value: +14.7% YoY*

- **Certificate Issuance Growth % (YoY)**:
  *Current Value: +65.3% YoY*

### Ranked & Summary Highlights
- **Top Performing Course**:
  ```dax
  Top Course = TOPN(1, VALUES('Student Course Details (2)'[Course]), [Total Revenue], DESC)
  ```
  *Current Value: DaVinci Resolve (₹1,400,000 / ~₹1.4M)*

- **Peak Enrollment Month**:
  ```dax
  Highest Enrollment Month = TOPN(1, VALUES('Student Course Details (2)'[Month]), [Total Students], DESC)
  ```
  *Current Value: November (116 Students)*

---

## 5. UI/UX Hierarchy & Visual Architecture

- **Visual Theme**: Cyberpunk / Deep Midnight Blue canvas (`#090D1A` and `#0E162B`) with glowing container cards.
- **Card Hierarchy**:
  - Top Bar: Universal Slicers (`Year`, `City`, `Course`) for instantaneous slice-and-dice.
  - KPI Row: 4 Hero metric cards paired with custom mini area sparklines to convey 12-month momentum at a glance.
  - Analytical Midsection:
    - **Course Revenue Bar Chart**: Ranks revenue contribution by course.
    - **Demographic Donut Chart**: Exposes cohort share.
    - **Certification Radial Gauge**: Shows progress toward 100% completion against total student enrollments.
  - Time-Series Floor: Full-width Monthly Enrollment Column Chart illustrating annual seasonality.
  - Summary Insights Footer: 5 quick-glance chips summarizing strategic takeaways.

---

## 6. Analytical Limitations

1. **Course Level Granularity in Detail Tab**: The `Courses` page serves as an active visual template duplicating the primary layout with tab activation styling; deeper drill-down attributes by instructor or syllabus module can be integrated as secondary schema tables become available.
2. **Interactive Cloud Hosting**: Power BI Service embedding requires organizational Power BI Pro/Premium capacity; this repository provides static high-fidelity captures and the full `.pbix` for local exploration.

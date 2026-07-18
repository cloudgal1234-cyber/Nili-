import type { DictionaryEntry } from '../types/dictionary';

/**
 * A small seed dictionary for local development and tests. A production
 * build should load thousands of entries (see README "Growing the
 * dictionary") from a bundled JSON file or a remote content service —
 * the engine itself doesn't care about dictionary size.
 *
 * Deliberately generous on 3- and 5-letter words: sampleTemplate.ts needs
 * both lengths for its six interlocking words, and more candidates per
 * length gives generateUniqueBoard a better chance of landing on a fill
 * that's provably the puzzle's only solution.
 */
export const sampleDictionary: DictionaryEntry[] = [
  // 3-letter
  { id: 'w1', word: 'שיר', length: 3, clues: ['יצירה מושרת', 'מילים ולחן יחד'] },
  { id: 'w2', word: 'צמח', length: 3, clues: ['גדל באדמה, ירוק'] },
  { id: 'w3', word: 'ילד', length: 3, clues: ['בן קטן'] },
  { id: 'w4', word: 'ספר', length: 3, clues: ['יש בו דפים לקריאה'] },
  { id: 'w5', word: 'גשם', length: 3, clues: ['יורד מהעננים'] },
  { id: 'w6', word: 'לחם', length: 3, clues: ['אופים אותו מקמח'] },
  { id: 'w7', word: 'חלב', length: 3, clues: ['שותים אותו, לבן'] },
  { id: 'w8', word: 'מלך', length: 3, clues: ['שליט הממלכה'] },
  { id: 'w9', word: 'ירח', length: 3, clues: ['נראה בשמיים בלילה'] },
  { id: 'w10', word: 'דלת', length: 3, clues: ['נכנסים ויוצאים דרכה'] },
  { id: 'w11', word: 'פרח', length: 3, clues: ['עלים צבעוניים ונעימי ריח'] },
  { id: 'w12', word: 'אור', length: 3, clues: ['ההפך מחושך'] },
  { id: 'w13', word: 'דבש', length: 3, clues: ['מתוק, מהדבורים'] },
  { id: 'w14', word: 'נחש', length: 3, clues: ['זוחל בלי רגליים'] },
  { id: 'w15', word: 'קול', length: 3, clues: ['שומעים אותו, לא רואים'] },
  { id: 'w16', word: 'רעש', length: 3, clues: ['ההפך משקט'] },
  { id: 'w17', word: 'טוב', length: 3, clues: ['ההפך מרע'] },
  { id: 'w18', word: 'חול', length: 3, clues: ['יש הרבה ממנו בים ובמדבר'] },
  { id: 'w19', word: 'סוד', length: 3, clues: ['משהו שלא מספרים לאף אחד'] },
  { id: 'w20', word: 'כלב', length: 3, clues: ['חבר טוב של האדם, נובח'] },
  { id: 'w21', word: 'שור', length: 3, clues: ['בהמת בר גדולה, מגדלים לבשר'] },
  { id: 'w21b', word: 'כהן', length: 3, clues: ['תפקיד דתי במקדש'] },
  { id: 'w21c', word: 'להב', length: 3, clues: ['החלק החד של סכין'] },
  { id: 'w21e', word: 'תור', length: 3, clues: ['ממתינים בו לתורם'] },
  { id: 'w21f', word: 'תיק', length: 3, clues: ['נושאים בו ספרים וחפצים'] },
  { id: 'w21h', word: 'מסע', length: 3, clues: ['נסיעה ארוכה'] },

  // 4-letter
  { id: 'w40', word: 'מחשב', length: 4, clues: ['מקליד עליו וגולש באינטרנט'] },
  { id: 'w41', word: 'כובע', length: 4, clues: ['חובשים אותו על הראש'] },
  { id: 'w42', word: 'גדול', length: 4, clues: ['ההפך מקטן'] },
  { id: 'w43', word: 'שחור', length: 4, clues: ['צבע הלילה'] },
  { id: 'w44', word: 'צהוב', length: 4, clues: ['צבעה של השמש'] },
  { id: 'w45', word: 'ורוד', length: 4, clues: ['צבע אהוב במיוחד'] },
  { id: 'w46', word: 'חלום', length: 4, clues: ['קורה בזמן השינה'] },
  { id: 'w47', word: 'עולם', length: 4, clues: ['כדור הארץ וכל מה שבו'] },
  { id: 'w48', word: 'כוכב', length: 4, clues: ['נראה בשמיים בלילה, מנצנץ'] },
  { id: 'w49', word: 'פרפר', length: 4, clues: ['חרק צבעוני עם כנפיים'] },
  { id: 'w50', word: 'תפוח', length: 4, clues: ['פרי אדום או ירוק, נופל לא רחוק מהעץ'] },
  { id: 'w51', word: 'בננה', length: 4, clues: ['פרי צהוב וארוך'] },
  { id: 'w52', word: 'תיבה', length: 4, clues: ['קופסה לאחסון'] },
  { id: 'w53', word: 'מכתב', length: 4, clues: ['שולחים אותו בדואר'] },

  // 5-letter
  { id: 'w22', word: 'שולחן', length: 5, clues: ['רהיט שאוכלים עליו'] },
  { id: 'w23', word: 'כרטיס', length: 5, clues: ['צריך כזה כדי לעלות לאוטובוס'] },
  { id: 'w24', word: 'מנורה', length: 5, clues: ['מאירה את החדר'] },
  { id: 'w25', word: 'ילדים', length: 5, clues: ['רבים מתוך "ילד"'] },
  { id: 'w26', word: 'אבטיח', length: 5, clues: ['פרי קיץ ירוק מבחוץ, אדום מבפנים'] },
  { id: 'w27', word: 'משפחה', length: 5, clues: ['הורים וילדים ביחד'] },
  { id: 'w28', word: 'ספרים', length: 5, clues: ['רבים מתוך "ספר"'] },
  { id: 'w29', word: 'מכונה', length: 5, clues: ['מכשיר שעושה עבודה בשבילנו'] },
  { id: 'w30', word: 'מדינה', length: 5, clues: ['ישראל היא אחת כזאת'] },
  { id: 'w31', word: 'עיתון', length: 5, clues: ['קוראים בו חדשות'] },
  { id: 'w33', word: 'תמונה', length: 5, clues: ['מצלמים אותה'] },
  { id: 'w34', word: 'גלידה', length: 5, clues: ['קינוח קר וקיצי'] },
  { id: 'w35', word: 'ילדות', length: 5, clues: ['תקופת החיים לפני הבגרות'] },

  // 7-letter
  { id: 'w60', word: 'ירושלים', length: 7, clues: ['בירת ישראל'] },
  { id: 'w61', word: 'תלמידים', length: 7, clues: ['לומדים בבית הספר'] },
  { id: 'w62', word: 'חופשיים', length: 7, clues: ['ההפך מכלואים, רבים מתוך "חופשי"'] },
  { id: 'w63', word: 'כדורגלן', length: 7, clues: ['משחק כדורגל במקצוע'] },
];

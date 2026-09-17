/**
 * numbers.js
 * Sistema próprio de números gigantes para o Régis Clicker.
 *
 * Representamos qualquer valor como mantissa (1 <= |m| < 10) * 10^expoente.
 * Isso evita NaN/Infinity mesmo com números muito além de Number.MAX_SAFE_INTEGER.
 */

class Decimal {
  constructor(mantissa = 0, exponent = 0) {
    this.mantissa = mantissa;
    this.exponent = exponent;
    this._normalize();
  }

  static fromNumber(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return new Decimal(0, 0);
    if (n === 0) return new Decimal(0, 0);
    if (!isFinite(n)) return new Decimal(n > 0 ? 1 : -1, 308); // trava de segurança, nunca deveria acontecer
    const sign = n < 0 ? -1 : 1;
    const abs = Math.abs(n);
    const exponent = Math.floor(Math.log10(abs));
    const mantissa = abs / Math.pow(10, exponent);
    return new Decimal(sign * mantissa, exponent);
  }

  static fromString(str) {
    if (typeof str !== 'string') return Decimal.from(str);
    str = str.trim();
    if (str === '') return new Decimal(0, 0);
    if (/e/i.test(str)) {
      const [m, e] = str.split(/e/i);
      const mantissa = parseFloat(m);
      const exponent = parseInt(e, 10);
      if (Number.isNaN(mantissa) || Number.isNaN(exponent)) return new Decimal(0, 0);
      return new Decimal(mantissa, exponent);
    }
    const n = parseFloat(str);
    return Decimal.fromNumber(Number.isNaN(n) ? 0 : n);
  }

  static from(value) {
    if (value instanceof Decimal) return value.clone();
    if (typeof value === 'number') return Decimal.fromNumber(value);
    if (typeof value === 'string') return Decimal.fromString(value);
    if (value && typeof value === 'object' && 'mantissa' in value && 'exponent' in value) {
      return new Decimal(value.mantissa, value.exponent);
    }
    return new Decimal(0, 0);
  }

  static get ZERO() { return new Decimal(0, 0); }
  static get ONE() { return new Decimal(1, 0); }

  clone() {
    return new Decimal(this.mantissa, this.exponent);
  }

  _normalize() {
    if (!isFinite(this.mantissa) || Number.isNaN(this.mantissa)) {
      this.mantissa = 0;
      this.exponent = 0;
      return this;
    }
    if (this.mantissa === 0) {
      this.exponent = 0;
      return this;
    }
    // corrige ruído de ponto flutuante
    let guard = 0;
    while (Math.abs(this.mantissa) >= 10 && guard < 400) {
      this.mantissa /= 10;
      this.exponent += 1;
      guard++;
    }
    guard = 0;
    while (Math.abs(this.mantissa) < 1 && this.mantissa !== 0 && guard < 400) {
      this.mantissa *= 10;
      this.exponent -= 1;
      guard++;
    }
    this.mantissa = Math.round(this.mantissa * 1e10) / 1e10;
    if (Math.abs(this.mantissa) >= 10) {
      this.mantissa /= 10;
      this.exponent += 1;
    }
    // trava de segurança máxima (10^9999) — o jogo nunca deveria chegar perto disso
    if (this.exponent > 9999) {
      this.exponent = 9999;
      this.mantissa = this.mantissa < 0 ? -9.999999999 : 9.999999999;
    }
    return this;
  }

  isZero() {
    return this.mantissa === 0;
  }

  isNegative() {
    return this.mantissa < 0;
  }

  add(other) {
    other = Decimal.from(other);
    if (this.isZero()) return other.clone();
    if (other.isZero()) return this.clone();
    const diff = this.exponent - other.exponent;
    if (diff > 17) return this.clone();
    if (diff < -17) return other.clone();
    if (diff >= 0) {
      const m = this.mantissa + other.mantissa / Math.pow(10, diff);
      return new Decimal(m, this.exponent);
    } else {
      const m = other.mantissa + this.mantissa / Math.pow(10, -diff);
      return new Decimal(m, other.exponent);
    }
  }

  sub(other) {
    other = Decimal.from(other);
    return this.add(new Decimal(-other.mantissa, other.exponent));
  }

  mul(other) {
    other = Decimal.from(other);
    return new Decimal(this.mantissa * other.mantissa, this.exponent + other.exponent);
  }

  div(other) {
    other = Decimal.from(other);
    if (other.isZero()) return Decimal.ZERO; // divisão por zero nunca deve travar o jogo
    return new Decimal(this.mantissa / other.mantissa, this.exponent - other.exponent);
  }

  /** multiplica por um número percentual simples, ex: mulPercent(25) => * 1.25 */
  mulPercent(pct) {
    return this.mul(Decimal.fromNumber(1 + pct / 100));
  }

  pow(n) {
    if (n === 0) return Decimal.ONE;
    if (this.isZero()) return Decimal.ZERO;
    const totalExp = this.exponent * n;
    const intExp = Math.floor(totalExp);
    const fracExp = totalExp - intExp;
    const newMantissa = Math.sign(this.mantissa) ** Math.round(n) >= 0 || n % 2 === 0
      ? Math.pow(Math.abs(this.mantissa), n) * Math.pow(10, fracExp)
      : -Math.pow(Math.abs(this.mantissa), n) * Math.pow(10, fracExp);
    return new Decimal(newMantissa, intExp);
  }

  cmp(other) {
    other = Decimal.from(other);
    if (this.isZero() && other.isZero()) return 0;
    if (this.isZero()) return other.mantissa > 0 ? -1 : 1;
    if (other.isZero()) return this.mantissa > 0 ? 1 : -1;
    const s1 = this.mantissa > 0 ? 1 : -1;
    const s2 = other.mantissa > 0 ? 1 : -1;
    if (s1 !== s2) return s1 > s2 ? 1 : -1;
    if (this.exponent !== other.exponent) {
      const cmp = this.exponent > other.exponent ? 1 : -1;
      return s1 > 0 ? cmp : -cmp;
    }
    if (this.mantissa === other.mantissa) return 0;
    return this.mantissa > other.mantissa ? 1 : -1;
  }

  gt(other) { return this.cmp(other) > 0; }
  gte(other) { return this.cmp(other) >= 0; }
  lt(other) { return this.cmp(other) < 0; }
  lte(other) { return this.cmp(other) <= 0; }
  eq(other) { return this.cmp(other) === 0; }

  max(other) { other = Decimal.from(other); return this.gte(other) ? this.clone() : other.clone(); }
  min(other) { other = Decimal.from(other); return this.lte(other) ? this.clone() : other.clone(); }

  /** valor aproximado como Number (pode perder precisão / virar Infinity acima de ~1e308) */
  toNumber() {
    if (this.exponent > 300) return this.mantissa > 0 ? Infinity : -Infinity;
    return this.mantissa * Math.pow(10, this.exponent);
  }

  toString() {
    return `${this.mantissa}e${this.exponent}`;
  }

  toJSON() {
    return { mantissa: this.mantissa, exponent: this.exponent };
  }
}

/* -------------------------------------------------------------------- */
/* Formatação                                                           */
/* -------------------------------------------------------------------- */

const SHORT_SCALE_SUFFIXES_PT = [
  '', 'mil', 'milhão', 'bilhão', 'trilhão', 'quatrilhão', 'quintilhão',
  'sextilhão', 'septilhão', 'octilhão', 'nonilhão', 'decilhão'
];
const SHORT_SCALE_SUFFIXES_PT_PLURAL = [
  '', 'mil', 'milhões', 'bilhões', 'trilhões', 'quatrilhões', 'quintilhões',
  'sextilhões', 'septilhões', 'octilhões', 'nonilhões', 'decilhões'
];

function formatPlainNumber(n, decimals) {
  // formata com separador de milhar '.' e decimal ',' (padrão BR)
  const fixed = n.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decPart !== undefined && parseInt(decPart, 10) !== 0
    ? `${withSep},${decPart}`
    : withSep;
}

/**
 * Formata um Decimal para exibição amigável em português.
 * @param {Decimal} value
 * @param {object} opts { decimals, compact }
 */
function formatNumber(value, opts = {}) {
  const dec = Decimal.from(value);
  const decimals = opts.decimals ?? 2;
  const compact = opts.compact ?? (typeof gameState !== 'undefined' ? gameState?.settings?.compactNumbers !== false : true);

  if (dec.isZero()) return '0';
  const sign = dec.isNegative() ? '-' : '';
  const absDec = new Decimal(Math.abs(dec.mantissa), dec.exponent);

  if (absDec.exponent < 3) {
    return sign + formatPlainNumber(absDec.toNumber(), absDec.exponent < 0 ? decimals : (Number.isInteger(absDec.toNumber()) ? 0 : decimals));
  }

  if (!compact) {
    return sign + formatPlainNumber(absDec.toNumber(), 0);
  }

  const group = Math.floor(absDec.exponent / 3);

  if (group <= 11) {
    const shift = absDec.exponent % 3;
    const displayValue = absDec.mantissa * Math.pow(10, shift);
    const suffixArr = displayValue >= 2 ? SHORT_SCALE_SUFFIXES_PT_PLURAL : SHORT_SCALE_SUFFIXES_PT;
    const suffix = suffixArr[group];
    return `${sign}${formatPlainNumber(displayValue, decimals)} ${suffix}`.trim();
  }

  // além de decilhões: notação científica, ex: 1.25e100
  return `${sign}${absDec.mantissa.toFixed(decimals)}e${absDec.exponent}`;
}

/** Versão curta sem espaço, usada em locais compactos (ex: badges) */
function formatShort(value) {
  return formatNumber(value, { decimals: 1 });
}

function formatPercent(n, decimals = 0) {
  return `${(n).toFixed(decimals).replace('.', ',')}%`;
}

function formatTime(totalSeconds) {
  totalSeconds = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}min`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Decimal, formatNumber, formatShort, formatPercent, formatTime };
}

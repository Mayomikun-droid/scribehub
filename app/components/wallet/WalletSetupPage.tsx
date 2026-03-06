'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  Shield, Upload, Check, X, ChevronDown,
  AlertTriangle, Lock, Eye, CreditCard,
  ArrowLeft, Camera, FileText,
} from 'lucide-react';

/* ── CURRENCIES ── */
const CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'GHC', symbol: 'GH₵', name: 'Ghana Cedi (alt)', flag: '🇬🇭' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', flag: '🇪🇹' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', flag: '🇹🇿' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', flag: '🇺🇬' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA', flag: '🌍' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc', flag: '🇷🇼' },
];

const ID_TYPES: Record<string, string[]> = {
  NG: ['National ID (NIN)', 'International Passport', "Driver's Licence", "Voter's Card"],
  GH: ['Ghana Card', 'International Passport', "Driver's Licence", 'Voter ID'],
  KE: ['Kenyan ID', 'International Passport', "Driver's Licence", 'KRA Pin Card'],
  ZA: ['South African ID', 'International Passport', "Driver's Licence"],
  default: ['International Passport', 'National ID Card', "Driver's Licence", 'Government-Issued ID'],
};

const NG_BANKS = [
  'Access Bank', 'GTBank', 'First Bank', 'Zenith Bank', 'UBA',
  'Sterling Bank', 'Fidelity Bank', 'Polaris Bank', 'Stanbic IBTC',
  'Opay', 'PalmPay', 'Kuda Bank', 'Carbon', 'Moniepoint',
];

/* ── FILE UPLOAD BOX ── */
function UploadBox({
  label, hint, value, onChange,
}: { label: string; hint: string; value: string | null; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${value ? 'rgba(204,255,0,0.4)' : 'rgba(123,47,255,0.3)'}`,
          borderRadius: '12px', padding: '20px', textAlign: 'center',
          cursor: 'pointer', background: value ? 'rgba(204,255,0,0.04)' : 'rgba(123,47,255,0.04)',
          transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
        }}
      >
        {value ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Check style={{ width: '18px', height: '18px', color: 'var(--accent-lime)' }} />
            <span style={{ fontSize: '13px', color: 'var(--accent-lime)', fontWeight: 600 }}>File uploaded</span>
          </div>
        ) : (
          <div>
            <Upload style={{ width: '24px', height: '24px', color: 'var(--text-disabled)', margin: '0 auto 8px' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{hint}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>JPG, PNG or PDF · Max 10MB</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function WalletSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  /* step 1 */
  const [currency, setCurrency] = useState<typeof CURRENCIES[0] | null>(null);
  const [currencySearch, setCurrencySearch] = useState('');
  const [showCurrencyList, setShowCurrencyList] = useState(false);

  /* step 2 - ID */
  const [idType, setIdType] = useState('');
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [idNumber, setIdNumber] = useState('');
  const [reviewing, setReviewing] = useState(false);

  /* step 3 - Bank */
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [fetchingName, setFetchingName] = useState(false);
  const [showBankList, setShowBankList] = useState(false);

  const goStep = (next: number) => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      opacity: 0, y: 20, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        setStep(next);
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      },
    });
  };

  /* simulate account name fetch */
  useEffect(() => {
    if (accountNumber.length === 10 && bank) {
      setFetchingName(true);
      setAccountName('');
      const t = setTimeout(() => {
        setAccountName('TEMI ADEYEMI');
        setFetchingName(false);
      }, 1800);
      return () => clearTimeout(t);
    } else {
      setAccountName('');
    }
  }, [accountNumber, bank]);

  const submitID = () => {
    if (!idType || !idFront || !idNumber) return;
    setReviewing(true);
    setTimeout(() => { setReviewing(false); goStep(3); }, 2500);
  };

  const filteredCurrencies = CURRENCIES.filter(c =>
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh', background: '#07080F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'var(--font-base)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Metallic background glows */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,20,60,0.8) 0%, transparent 70%)',
        top: '-100px', left: '-100px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '600px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,47,255,0.06) 0%, transparent 70%)',
        bottom: '0', right: '0', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 10 }}>

        {/* Header badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <Shield style={{ width: '16px', height: '16px', color: 'var(--accent-lime)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Secured · Bank-grade encryption
          </span>
          <Lock style={{ width: '14px', height: '14px', color: 'var(--text-disabled)' }} />
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
          {['Currency', 'Identity', 'Bank Account', 'Done'].map((label, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{
                height: '3px', borderRadius: '999px', marginBottom: '6px',
                background: i + 1 <= step ? 'var(--brand-violet)' : 'var(--bg-elevated)',
                transition: 'background 0.4s',
              }} />
              <span style={{
                fontSize: '10px', color: i + 1 === step ? 'var(--brand-light)' : 'var(--text-disabled)',
                fontWeight: i + 1 === step ? 600 : 400,
              }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(12,12,20,0.95)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '36px',
          boxShadow: '0 32px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <div ref={contentRef}>

            {/* ── STEP 1: Currency ── */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Set your currency.
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
                  Choose the currency you'll earn and withdraw in. You can change this later.
                </p>

                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input className="input-field"
                    placeholder="Search currency..."
                    value={currency ? `${currency.flag}  ${currency.name} (${currency.code})` : currencySearch}
                    onFocus={() => { setShowCurrencyList(true); if (currency) { setCurrencySearch(''); setCurrency(null); } }}
                    onChange={e => { setCurrencySearch(e.target.value); setShowCurrencyList(true); }}
                  />
                  <ChevronDown style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-disabled)', pointerEvents: 'none' }} />
                  {showCurrencyList && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                      background: '#151520', border: '1px solid var(--border-subtle)',
                      borderRadius: '12px', marginTop: '4px', maxHeight: '220px', overflowY: 'auto',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                    }}>
                      {filteredCurrencies.map(c => (
                        <button key={c.code} onClick={() => { setCurrency(c); setShowCurrencyList(false); }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '10px 14px', background: 'transparent', border: 'none',
                            cursor: 'pointer', textAlign: 'left',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(123,47,255,0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ fontSize: '20px' }}>{c.flag}</span>
                          <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{c.name}</span>
                          <span style={{
                            marginLeft: 'auto', fontSize: '12px', fontWeight: 600,
                            color: 'var(--text-secondary)', background: 'var(--bg-elevated)',
                            padding: '2px 8px', borderRadius: '6px',
                          }}>{c.symbol} {c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {currency && (
                  <div style={{
                    padding: '16px', borderRadius: '12px', marginBottom: '20px',
                    background: 'rgba(123,47,255,0.08)', border: '1px solid rgba(123,47,255,0.2)',
                    display: 'flex', alignItems: 'center', gap: '16px',
                  }}>
                    <span style={{ fontSize: '32px' }}>{currency.flag}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                        {currency.symbol} — {currency.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        All earnings will be displayed in {currency.code}
                      </p>
                    </div>
                  </div>
                )}

                <button onClick={() => { if (currency) goStep(2); }} style={{
                  width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700,
                  fontSize: '15px', cursor: 'pointer', border: 'none',
                  background: currency ? 'var(--brand-violet)' : 'rgba(123,47,255,0.3)',
                  color: 'white', boxShadow: currency ? '0 8px 24px rgba(123,47,255,0.35)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  Continue to Verification →
                </button>
              </div>
            )}

            {/* ── STEP 2: ID Verification ── */}
            {step === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Shield style={{ width: '20px', height: '20px', color: 'var(--brand-light)' }} />
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Verify your identity.
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Required by law to prevent fraud and enable payouts. Your data is encrypted and never sold.
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
                  padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}>
                  <AlertTriangle style={{ width: '13px', height: '13px', color: '#EF4444', flexShrink: 0 }} />
                  <p style={{ fontSize: '12px', color: '#EF4444' }}>
                    Submitting false or someone else's ID is a permanent ban offence.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  {/* ID Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      ID Type
                    </label>
                    <select className="input-field" value={idType} onChange={e => setIdType(e.target.value)}
                      style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B7BA8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '40px' }}>
                      <option value="" disabled>Select ID type</option>
                      {(ID_TYPES['NG']).map(t => (
                        <option key={t} value={t} style={{ background: '#1A1A28' }}>{t}</option>
                      ))}
                      <optgroup label="Other countries" style={{ background: '#1A1A28' }}>
                        {ID_TYPES['GH'].map(t => <option key={t} value={t} style={{ background: '#1A1A28' }}>{t}</option>)}
                        {ID_TYPES['KE'].map(t => <option key={t} value={t} style={{ background: '#1A1A28' }}>{t}</option>)}
                        {ID_TYPES['default'].map(t => <option key={t} value={t} style={{ background: '#1A1A28' }}>{t}</option>)}
                      </optgroup>
                    </select>
                  </div>

                  {/* ID Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      ID Number
                    </label>
                    <input className="input-field" placeholder="Enter your ID number"
                      value={idNumber} onChange={e => setIdNumber(e.target.value.toUpperCase())} />
                  </div>

                  <UploadBox label="ID Front" hint="Take a clear photo of the front" value={idFront} onChange={setIdFront} />
                  {idType && idType !== 'NIN Slip' && (
                    <UploadBox label="ID Back" hint="Take a clear photo of the back" value={idBack} onChange={setIdBack} />
                  )}
                  <UploadBox label="Selfie with ID" hint="Hold your ID next to your face" value={selfie} onChange={setSelfie} />
                </div>

                <div style={{
                  padding: '12px', borderRadius: '10px', marginBottom: '16px',
                  background: 'rgba(123,47,255,0.06)', border: '1px solid rgba(123,47,255,0.15)',
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                }}>
                  <Eye style={{ width: '14px', height: '14px', color: 'var(--text-disabled)', marginTop: '1px', flexShrink: 0 }} />
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Verification typically takes 10–30 minutes. You'll be notified once approved. Until then you can still earn — just not withdraw.
                  </p>
                </div>

                {reviewing ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      border: '3px solid rgba(123,47,255,0.3)',
                      borderTopColor: 'var(--brand-violet)',
                      margin: '0 auto 12px', animation: 'spin 1s linear infinite',
                    }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Submitting your ID securely...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => goStep(1)} style={{ padding: '14px 20px', borderRadius: '12px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                      <ArrowLeft style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button onClick={submitID} style={{
                      flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 700,
                      fontSize: '14px', cursor: 'pointer', border: 'none',
                      background: (idType && idFront && idNumber) ? 'var(--brand-violet)' : 'rgba(123,47,255,0.3)',
                      color: 'white',
                    }}>
                      Submit for Verification →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Bank Account ── */}
            {step === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <CreditCard style={{ width: '20px', height: '20px', color: 'var(--brand-light)' }} />
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Add bank account.
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  This account will receive your withdrawals. Must match your verified ID name.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  {/* Bank Select */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      Bank Name
                    </label>
                    <input className="input-field"
                      placeholder="Search bank..."
                      value={bank}
                      onFocus={() => setShowBankList(true)}
                      onChange={e => { setBank(e.target.value); setShowBankList(true); }}
                    />
                    {showBankList && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                        background: '#151520', border: '1px solid var(--border-subtle)',
                        borderRadius: '12px', marginTop: '4px', maxHeight: '180px', overflowY: 'auto',
                      }}>
                        {NG_BANKS.filter(b => b.toLowerCase().includes(bank.toLowerCase())).map(b => (
                          <button key={b} onClick={() => { setBank(b); setShowBankList(false); }}
                            style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: 'var(--text-primary)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(123,47,255,0.1)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >{b}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Account Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      Account Number
                    </label>
                    <input className="input-field"
                      placeholder="10-digit account number"
                      value={accountNumber}
                      maxLength={10}
                      onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  {/* Account Name (auto-fetched) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      Account Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input className="input-field"
                        readOnly
                        placeholder={fetchingName ? 'Fetching name...' : 'Auto-filled from account number'}
                        value={accountName}
                        style={{
                          color: accountName ? 'var(--accent-lime)' : 'var(--text-disabled)',
                          fontWeight: accountName ? 600 : 400,
                          cursor: 'default',
                        }}
                      />
                      {fetchingName && (
                        <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                          <div style={{
                            width: '16px', height: '16px', borderRadius: '50%',
                            border: '2px solid rgba(123,47,255,0.3)',
                            borderTopColor: 'var(--brand-violet)',
                            animation: 'spin 0.8s linear infinite',
                          }} />
                        </div>
                      )}
                      {accountName && (
                        <Check style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--accent-lime)' }} />
                      )}
                    </div>
                    {accountName && (
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        ⚠️ Confirm this name matches your verified ID exactly.
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => goStep(2)} style={{ padding: '14px 20px', borderRadius: '12px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button onClick={() => { if (accountName && bank) goStep(4); }} style={{
                    flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 700,
                    fontSize: '14px', cursor: 'pointer', border: 'none',
                    background: (accountName && bank) ? 'var(--brand-violet)' : 'rgba(123,47,255,0.3)',
                    color: 'white',
                    boxShadow: (accountName && bank) ? '0 8px 24px rgba(123,47,255,0.35)' : 'none',
                  }}>
                    Save Bank Account →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Done ── */}
            {step === 4 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(204,255,0,0.1)', border: '2px solid var(--accent-lime)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <Check style={{ width: '36px', height: '36px', color: 'var(--accent-lime)' }} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Wallet activated!
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Your <strong style={{ color: 'var(--text-primary)' }}>{currency?.name}</strong> wallet is ready. Bank account saved.
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  ID verification is under review — you'll be notified once payouts are fully unlocked (usually within 30 minutes).
                </p>

                {/* Summary card */}
                <div style={{
                  background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', marginBottom: '24px',
                  textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px',
                }}>
                  {[
                    { label: 'Currency', value: `${currency?.flag} ${currency?.symbol} ${currency?.code}` },
                    { label: 'Bank', value: bank },
                    { label: 'Account', value: `${accountNumber.slice(0, 3)}*****${accountNumber.slice(-2)}` },
                    { label: 'ID Status', value: '⏳ Under review' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-disabled)' }}>{label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => router.push('/dashboard')} style={{
                  width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700,
                  fontSize: '15px', cursor: 'pointer', border: 'none',
                  background: 'linear-gradient(135deg, var(--brand-violet), #9333EA)',
                  color: 'white', boxShadow: '0 8px 24px rgba(123,47,255,0.4)',
                }}>
                  Go to Dashboard →
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
import './MedicalDisclaimer.css';

export default function MedicalDisclaimer() {
  return (
    <div className="medical-disclaimer">
      <div className="disclaimer-icon">⚠️</div>
      <div className="disclaimer-content">
        <strong>IMPORTANT MEDICAL DISCLAIMER</strong>
        <p>
          This is an AI-powered wellness reflection tool for educational and self-exploration purposes only.
          This is NOT medical advice, therapy, or professional healthcare.
          Always consult licensed healthcare professionals for medical, mental health, or wellness concerns.
        </p>
      </div>
    </div>
  );
}

/**
 * Telemetry Integrity Interceptor
 * Validates student telemetry payloads against impossible typing speeds and tampering.
 */
export function validateTelemetryIntegrity(telemetry = {}, code = '', sessionDurationSec = 60) {
  const codeLength = code.length;
  const pasteEvents = telemetry.pasteEvents || [];
  const burstEvents = telemetry.burstEvents || [];

  // Max typing speed: 12 chars per second sustained (~144 WPM)
  const maxPossibleChars = Math.max(100, sessionDurationSec * 12);

  let totalPastedChars = 0;
  for (const pe of pasteEvents) {
    totalPastedChars += pe.charCount || 0;
  }

  const typedChars = codeLength - totalPastedChars;

  // Rule 1: Typed chars cannot exceed max physical typing speed
  if (typedChars > maxPossibleChars && sessionDurationSec < 10) {
    return {
      isValid: false,
      reason: 'TAMPERED_TELEMETRY',
      message: 'Typing speed exceeds human physical limits for session duration.',
    };
  }

  // Rule 2: Char count in paste events cannot exceed total code length
  if (totalPastedChars > codeLength + 50) {
    return {
      isValid: false,
      reason: 'TAMPERED_TELEMETRY',
      message: 'Paste event char counts contradict total submitted code length.',
    };
  }

  return {
    isValid: true,
    pasteEventsCount: pasteEvents.length,
    burstEventsCount: burstEvents.length,
    suspicionScore: Math.min(100, (pasteEvents.length * 25) + (burstEvents.length * 15)),
  };
}

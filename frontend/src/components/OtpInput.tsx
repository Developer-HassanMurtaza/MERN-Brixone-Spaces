import React, { useMemo, useRef } from "react";
import { Input } from "antd";
import type { InputRef } from "antd";

interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
}

export default function OtpInput({
  length = 6,
  value = "",
  onChange,
}: OtpInputProps) {
  const inputsRef = useRef<Array<InputRef | null>>([]);
  const digits = useMemo(() => {
    const chars = value.split("").slice(0, length);
    while (chars.length < length) chars.push("");
    return chars;
  }, [value, length]);

  function focusAt(index: number) {
    const next = inputsRef.current[index];
    next?.focus?.();
  }

  function setDigitAt(index: number, char: string) {
    const numeric = char.replace(/\D/g, "");
    if (!numeric) return;
    const nextValue = digits
      .map((d, i) => (i === index ? numeric[numeric.length - 1] : d))
      .join("");
    onChange?.(nextValue);
    if (index < length - 1) focusAt(index + 1);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    setDigitAt(index, e.target.value);
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const nextValue = digits.map((d, i) => (i === index ? "" : d)).join("");
        onChange?.(nextValue);
      } else if (index > 0) {
        focusAt(index - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft" && index > 0) focusAt(index - 1);
    if (e.key === "ArrowRight" && index < length - 1) focusAt(index + 1);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!paste) return;
    const nextValue = paste.padEnd(length, "");
    onChange?.(nextValue);
    const goTo = Math.min(paste.length, length - 1);
    focusAt(goTo);
  }

  return (
    <div className="otp-container">
      {digits.map((digit, index) => (
        <Input
          key={index}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          size="large"
          className="otp-input"
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}

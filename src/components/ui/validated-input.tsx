import { useState, useEffect } from "react";
import { ValidationResult } from "@/lib/types";
import { debounce } from "@/lib/validation";

interface ValidatedInputProps {
  label: string;
  type?: "text" | "email" | "tel" | "number" | "password";
  value: string;
  onChange: (value: string) => void;
  validator?: (value: string) => ValidationResult;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  icon?: string;
  description?: string;
}

export function ValidatedInput({
  label,
  type = "text",
  value,
  onChange,
  validator,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  validateOnChange = true,
  validateOnBlur = true,
  icon,
  description
}: ValidatedInputProps) {
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Debounced validation for real-time feedback
  const debouncedValidate = debounce((val: string) => {
    if (validator && touched && validateOnChange) {
      setIsValidating(true);
      const result = validator(val);
      setError(result.errors[0] || "");
      setIsValidating(false);
    }
  }, 300);

  useEffect(() => {
    if (validateOnChange) {
      debouncedValidate(value);
    }
  }, [value, validateOnChange, debouncedValidate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validator && validateOnBlur) {
      const result = validator(value);
      setError(result.errors[0] || "");
    }
  };

  const hasError = error && touched;
  const isValid = touched && !error && value.trim() !== "";

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-lg">{icon}</span>
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm text-sm
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${
              hasError
                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                : isValid
                ? 'border-green-300 focus:ring-green-500 bg-green-50'
                : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
            }
          `}
        />

        {/* Validation Status Icons */}
        {touched && !isValidating && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {hasError ? (
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : isValid ? (
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : null}
          </div>
        )}

        {/* Loading Spinner */}
        {isValidating && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <div className="flex items-center space-x-1 text-red-600 text-xs">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {isValid && !hasError && (
        <div className="flex items-center space-x-1 text-green-600 text-xs">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Looks good!</span>
        </div>
      )}
    </div>
  );
}

// Enhanced Select Component with Validation
interface ValidatedSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  validator?: (value: string) => ValidationResult;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function ValidatedSelect({
  label,
  value,
  onChange,
  options,
  validator,
  required = false,
  disabled = false,
  className = "",
  placeholder = "Select an option"
}: ValidatedSelectProps) {
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validator) {
      const result = validator(value);
      setError(result.errors[0] || "");
    }
  };

  const hasError = error && touched;
  const isValid = touched && !error && value.trim() !== "";

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm text-sm
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${
            hasError
              ? 'border-red-300 focus:ring-red-500 bg-red-50'
              : isValid
              ? 'border-green-300 focus:ring-green-500 bg-green-50'
              : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
          }
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && (
        <div className="flex items-center space-x-1 text-red-600 text-xs">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
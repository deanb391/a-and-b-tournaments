interface StepIndicatorProps {
  currentStep: "form" | "otp" | "success";
}

const steps = [
  { id: "form", label: "Your Details" },
  { id: "otp",  label: "Verify Email" },
  { id: "success", label: "Confirmed" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isActive    = i === currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-black text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-navy border-navy text-white"
                    : isActive
                    ? "bg-red border-red text-white scale-110"
                    : "bg-transparent border-navy/20 text-navy/30"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  isActive ? "text-red" : isCompleted ? "text-navy" : "text-navy/30"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 sm:w-20 mb-5 mx-1 transition-all duration-300 ${
                  isCompleted ? "bg-navy" : "bg-navy/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

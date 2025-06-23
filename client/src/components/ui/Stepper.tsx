'use client';

import React from 'react';

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dots' | 'progress';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showConnectors?: boolean;
  alternativeLabels?: boolean;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  showLabels = true,
  showConnectors = true,
  alternativeLabels = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      step: 'w-6 h-6 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm',
      connector: 'h-0.5',
      spacing: 'space-y-2',
    },
    md: {
      step: 'w-8 h-8 text-base',
      icon: 'w-5 h-5',
      text: 'text-base',
      connector: 'h-0.5',
      spacing: 'space-y-3',
    },
    lg: {
      step: 'w-10 h-10 text-lg',
      icon: 'w-6 h-6',
      text: 'text-lg',
      connector: 'h-1',
      spacing: 'space-y-4',
    },
  };

  const renderStepIcon = (step: Step, index: number, isCompleted: boolean) => {
    if (variant === 'dots') {
      return (
        <div
          className={`
            rounded-full
            ${isCompleted
              ? 'bg-indigo-600'
              : index === activeStep
                ? 'bg-indigo-200'
                : 'bg-gray-200'
            }
            ${sizeClasses[size].step}
          `}
        />
      );
    }

    if (variant === 'progress') {
      return (
        <div
          className={`
            flex items-center justify-center rounded-full
            ${isCompleted
              ? 'bg-indigo-600 text-white'
              : index === activeStep
                ? 'border-2 border-indigo-600 text-indigo-600'
                : 'border-2 border-gray-200 text-gray-400'
            }
            ${sizeClasses[size].step}
          `}
        >
          {isCompleted ? (
            <i className={`fas fa-check ${sizeClasses[size].icon}`} />
          ) : (
            <span>{index + 1}</span>
          )}
        </div>
      );
    }

    return (
      <div
        className={`
          flex items-center justify-center rounded-full
          ${isCompleted
            ? 'bg-indigo-600 text-white'
            : index === activeStep
              ? 'border-2 border-indigo-600 text-indigo-600'
              : 'border-2 border-gray-200 text-gray-400'
          }
          ${sizeClasses[size].step}
        `}
      >
        {step.icon ? (
          <span className={sizeClasses[size].icon}>{step.icon}</span>
        ) : isCompleted ? (
          <i className={`fas fa-check ${sizeClasses[size].icon}`} />
        ) : (
          <span>{index + 1}</span>
        )}
      </div>
    );
  };

  const renderConnector = (index: number) => {
    if (!showConnectors || index === steps.length - 1) return null;

    const isCompleted = index < activeStep;

    return (
      <div
        className={`
          flex-1
          ${orientation === 'horizontal' ? 'mx-4' : 'my-4'}
          ${sizeClasses[size].connector}
          ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}
        `}
      />
    );
  };

  const renderStepContent = (step: Step, index: number) => {
    if (!showLabels) return null;

    return (
      <div
        className={`
          ${alternativeLabels ? 'text-center' : ''}
          ${orientation === 'horizontal'
            ? alternativeLabels ? 'mt-2' : 'ml-3'
            : 'ml-3'
          }
        `}
      >
        <div className={`font-medium ${sizeClasses[size].text}`}>
          {step.label}
          {step.optional && (
            <span className="ml-1 text-gray-500 text-sm">
              (Optional)
            </span>
          )}
        </div>
        {step.description && (
          <p className="mt-1 text-gray-500 text-sm">
            {step.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        ${orientation === 'horizontal' ? 'flex' : 'flex-col'}
        ${className}
      `}
    >
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;

        return (
          <div
            key={step.id}
            className={`
              ${orientation === 'horizontal'
                ? `flex ${alternativeLabels ? 'flex-col items-center' : 'items-center'} flex-1`
                : `flex ${sizeClasses[size].spacing}`
              }
            `}
          >
            <div className="flex items-center flex-1">
              {/* Step icon */}
              {renderStepIcon(step, index, isCompleted)}

              {/* Connector */}
              {renderConnector(index)}
            </div>

            {/* Step content */}
            {renderStepContent(step, index)}
          </div>
        );
      })}
    </div>
  );
};

// Form stepper variant
interface FormStep extends Step {
  content: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

interface FormStepperProps extends Omit<StepperProps, 'steps'> {
  steps: FormStep[];
  onComplete?: () => void;
  onStepChange?: (step: number) => void;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  steps,
  activeStep,
  onComplete,
  onStepChange,
  ...props
}) => {
  const handleNext = async () => {
    const currentStep = steps[activeStep];
    if (currentStep.validate) {
      const isValid = await currentStep.validate();
      if (!isValid) return;
    }

    if (activeStep === steps.length - 1) {
      onComplete?.();
    } else {
      onStepChange?.(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      onStepChange?.(activeStep - 1);
    }
  };

  return (
    <div className="space-y-8">
      <Stepper
        {...props}
        steps={steps}
        activeStep={activeStep}
      />

      <div className="mt-8">
        {steps[activeStep].content}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={activeStep === 0}
          className={`
            px-4 py-2 text-sm font-medium rounded-md
            ${activeStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }
          `}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="
            px-4 py-2 text-sm font-medium text-white
            bg-indigo-600 hover:bg-indigo-700
            rounded-md
          "
        >
          {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Stepper;

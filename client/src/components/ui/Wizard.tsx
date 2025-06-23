'use client';

import React, { useState, useCallback } from 'react';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

interface WizardProps {
  steps: Step[];
  initialStep?: number;
  onComplete?: (data: any) => void;
  onStepChange?: (currentStep: number, direction: 'next' | 'prev') => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dots' | 'numbers';
  size?: 'sm' | 'md' | 'lg';
}

const Wizard: React.FC<WizardProps> = ({
  steps,
  initialStep = 0,
  onComplete,
  onStepChange,
  className = '',
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [isValidating, setIsValidating] = useState(false);

  const sizeClasses = {
    sm: {
      text: 'text-sm',
      icon: 'w-6 h-6',
      content: 'p-4',
      step: 'w-6 h-6',
    },
    md: {
      text: 'text-base',
      icon: 'w-8 h-8',
      content: 'p-6',
      step: 'w-8 h-8',
    },
    lg: {
      text: 'text-lg',
      icon: 'w-10 h-10',
      content: 'p-8',
      step: 'w-10 h-10',
    },
  };

  const handleNext = useCallback(async () => {
    const currentStepData = steps[currentStep];
    
    if (currentStepData.validate) {
      setIsValidating(true);
      try {
        const isValid = await currentStepData.validate();
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      } catch (error) {
        setIsValidating(false);
        return;
      }
    }
    
    setIsValidating(false);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      onStepChange?.(currentStep + 1, 'next');
    } else {
      onComplete?.(stepData);
    }
  }, [currentStep, steps, onComplete, onStepChange, stepData]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      onStepChange?.(currentStep - 1, 'prev');
    }
  }, [currentStep, onStepChange]);

  const handleStepClick = useCallback((index: number) => {
    if (index < currentStep) {
      setCurrentStep(index);
      onStepChange?.(index, 'prev');
    }
  }, [currentStep, onStepChange]);

  const renderStepIndicator = (step: Step, index: number) => {
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;

    switch (variant) {
      case 'dots':
        return (
          <div
            className={`
              rounded-full transition-colors
              ${sizeClasses[size].step}
              ${isCompleted ? 'bg-indigo-600' : isCurrent ? 'bg-indigo-200' : 'bg-gray-200'}
            `}
          />
        );
      case 'numbers':
        return (
          <div
            className={`
              flex items-center justify-center rounded-full
              ${sizeClasses[size].step}
              ${isCompleted
                ? 'bg-indigo-600 text-white'
                : isCurrent
                  ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600'
                  : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
              }
            `}
          >
            {isCompleted ? (
              <i className="fas fa-check" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
        );
      default:
        return (
          <div
            className={`
              flex items-center justify-center rounded-full
              ${sizeClasses[size].icon}
              ${isCompleted
                ? 'bg-indigo-600 text-white'
                : isCurrent
                  ? 'bg-white text-indigo-600 border-2 border-indigo-600'
                  : 'bg-white text-gray-400 border-2 border-gray-200'
              }
            `}
          >
            {step.icon || (
              isCompleted ? (
                <i className="fas fa-check" />
              ) : (
                <span>{index + 1}</span>
              )
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={`
        ${orientation === 'vertical' ? 'flex space-x-8' : ''}
        ${className}
      `}
    >
      {/* Steps navigation */}
      <div
        className={`
          ${orientation === 'vertical'
            ? 'flex-shrink-0 w-64'
            : 'mb-8'
          }
        `}
      >
        <div
          className={`
            ${orientation === 'vertical'
              ? 'flex flex-col space-y-4'
              : 'flex justify-between'
          }
          ${sizeClasses[size].text}
          relative
        `}
        >
          {/* Progress line */}
          {variant !== 'dots' && (
            <div
              className={`
                absolute bg-gray-200
                ${orientation === 'vertical'
                  ? 'left-4 top-0 bottom-0 w-px'
                  : 'left-0 right-0 top-4 h-px'
                }
              `}
            >
              <div
                className="absolute bg-indigo-600 transition-all duration-300"
                style={{
                  [orientation === 'vertical' ? 'height' : 'width']: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          )}

          {steps.map((step, index) => (
            <div
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`
                relative flex items-center
                ${orientation === 'vertical' ? '' : 'flex-col'}
                ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
            >
              {renderStepIndicator(step, index)}
              <div
                className={`
                  ${orientation === 'vertical' ? 'ml-4' : 'mt-2'}
                  ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}
                `}
              >
                <div className="font-medium">{step.title}</div>
                {step.description && (
                  <div className="text-sm text-gray-500">{step.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1">
        <div className={sizeClasses[size].content}>
          {steps[currentStep].content}
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }
            `}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isValidating}
            className={`
              px-4 py-2 rounded-md text-sm font-medium text-white
              ${isValidating
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
              }
            `}
          >
            {isValidating ? (
              <i className="fas fa-spinner fa-spin mr-2" />
            ) : null}
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Form wizard variant
interface FormStep extends Omit<Step, 'content'> {
  fields: React.ReactNode;
  initialValues?: Record<string, any>;
  validationSchema?: any;
}

interface FormWizardProps extends Omit<WizardProps, 'steps'> {
  steps: FormStep[];
  onSubmit: (values: Record<string, any>) => void;
}

export const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  onSubmit,
  ...props
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleStepSubmit = (stepData: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleComplete = () => {
    onSubmit(formData);
  };

  const wizardSteps = steps.map((step) => ({
    ...step,
    content: (
      <div>
        {step.fields}
      </div>
    ),
  }));

  return (
    <Wizard
      {...props}
      steps={wizardSteps}
      onComplete={handleComplete}
    />
  );
};

export default Wizard;

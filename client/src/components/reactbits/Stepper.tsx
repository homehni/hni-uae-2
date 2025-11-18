"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <motion.div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-muted-foreground text-muted-foreground"
                  }`}
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: isCurrent ? Infinity : 0,
                    repeatDelay: 1,
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </motion.div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 relative">
                  <div className="absolute inset-0 bg-muted" />
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: isCompleted ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}



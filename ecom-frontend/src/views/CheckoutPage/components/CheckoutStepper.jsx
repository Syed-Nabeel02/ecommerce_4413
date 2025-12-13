/**
 * CheckoutStepper.jsx
 * Custom step indicator for checkout process.
 * Replaces MUI Stepper with a Tailwind-styled component.
 */

import React from 'react';
import { FaCheck } from 'react-icons/fa';

const CheckoutStepper = ({ steps, activeStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors
                  ${index < activeStep
                    ? 'bg-green-500 text-white'
                    : index === activeStep
                    ? 'bg-custom-blue text-white'
                    : 'bg-gray-300 text-gray-600'
                  }`}>
                {index < activeStep ? (
                  <FaCheck className="text-sm" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <span className={`mt-2 text-sm font-medium ${
                index <= activeStep ? 'text-slate-800' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-1 mx-2 mb-6 transition-colors ${
                  index < activeStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutStepper;

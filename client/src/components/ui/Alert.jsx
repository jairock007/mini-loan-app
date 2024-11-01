import React from "react";

const Alert = ({ className = "", variant = "default", children, ...props }) => {
    const variantStyles = {
        default: "bg-gray-100 text-gray-900",
        destructive: "bg-red-100 text-red-900 border-red-200"
    };

    return (
        <div
            role="alert"
            className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const AlertDescription = ({ className = "", children, ...props }) => (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props}>
        {children}
    </div>
);

export { Alert, AlertDescription };
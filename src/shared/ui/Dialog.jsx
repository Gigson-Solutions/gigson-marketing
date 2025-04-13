import {useEffect} from "react";

const Dialog = ({ isOpen, onClose, children, size = "lg" }) => {
    if (!isOpen) return null;

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    const sizeClass = {
        sm: "max-w-xl",
        md: "max-w-4xl",
        lg: "max-w-7xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex md:items-center items-end justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className={`relative bg-white rounded-[30px] shadow-lg w-full ${sizeClass[size]} max-h-[90vh] md:max-h-[80vh] md:m-8 p-4 overflow-auto`}>
                {children}
            </div>
        </div>
    );
};

export default Dialog;

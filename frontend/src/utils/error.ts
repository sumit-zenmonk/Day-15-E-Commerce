import { useSnackbar } from "notistack";

export const useErrorHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleError = (error: any) => {
        if (!error) return;
        console.log(error);
        let messages: string[] = [];

        if (Array.isArray(error)) messages = error;
        else if (Array.isArray(error?.message)) messages = error.message;
        else if (typeof error.message === "string") messages = [error.message];
        else if (typeof error === "string") messages = [error]
        else messages = ["An unknown error occurred"];

        messages.forEach(msg => {
            enqueueSnackbar(msg, { variant: "error" });
        });
    };

    return { handleError };
};
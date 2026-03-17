"use client";

import { Box, Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { ORDER_STAGE } from "@/enums/order.enum";
import { RoleEnum } from "@/enums/role.enum";

const steps = [
    ORDER_STAGE.ONBOARD,
    ORDER_STAGE.INWAY,
    ORDER_STAGE.DELIVERED,
];

interface Props {
    stage: ORDER_STAGE;
    role: RoleEnum;
    onChange: (stage: ORDER_STAGE) => void;
    loading?: boolean;
}

export default function OrderStepper({ stage, role, onChange, loading = false }: Props) {
    const activeStep = steps.indexOf(stage);

    const handleNext = () => {
        if (!loading && activeStep < steps.length - 1) {
            onChange(steps[activeStep + 1]);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                mt: 2,
                p: 2,
                borderRadius: "12px",
                background: "#f9fafb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;

                    return (
                        <Step key={label}>
                            <StepLabel
                                icon={
                                    isCompleted ? (
                                        <CheckCircleIcon color="success" />
                                    ) : isActive ? (
                                        <CheckCircleIcon color="primary" />
                                    ) : (
                                        <RadioButtonUncheckedIcon color="disabled" />
                                    )
                                }
                            >
                                <Typography
                                    sx={{
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? "#1976d2" : "#555",
                                    }}
                                >
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            {role === RoleEnum.SELLER && activeStep < steps.length - 1 && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={loading}
                        sx={{
                            borderRadius: "20px",
                            px: 4,
                            py: 1,
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        {loading ? "Updating..." : `Move to ${steps[activeStep + 1]}`}
                    </Button>
                </Box>
            )}

            {activeStep === steps.length - 1 && (
                <Typography
                    sx={{
                        textAlign: "center",
                        mt: 2,
                        fontWeight: 600,
                        color: "green",
                    }}
                >
                    Order Delivered 🎉
                </Typography>
            )}
        </Box>
    );
}
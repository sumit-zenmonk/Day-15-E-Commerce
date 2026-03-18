export const menuPaperSx = {
    width: "180px",
    backgroundColor: "transparent",
    color: "rgba(255, 255, 255, 0.98)",
    fontWeight: 900,
    borderRadius: "20px",
    textAlign: "center",
};

export const menuItemSx = {
    fontWeight: 700,
    border: "2px solid transparent",
    borderRadius: "20px",
    color: "rgba(0, 89, 255, 0.98)",
    "&:hover": {
        border: "2px solid rgba(0, 153, 255, 0.98)",
    },
};

export const logoutItemSx = {
    ...menuItemSx,
    color: "red",
};

export const menuButtonSx = {
    minWidth: "80px",
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#000",
    borderRadius: "500px",
    textTransform: "uppercase",
    fontWeight: 700,
    border:"transparent"
};
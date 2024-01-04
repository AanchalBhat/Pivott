import LoadingButton from "@mui/lab/LoadingButton";
import { CircularProgress } from "@mui/material";

export const ButtonLoader = ({
    loading,
    disabled = loading,
    id = "",
    fullWidth = false,
    classStyle,
    btnType,
    handleClick,
    title,
    variant = "contained",
    testid = "",
    autoFocus = false,
    spanTextClass,
    style = {},
    img = null,
    href = ""
}) => {
    const renderContent = () => {
        if (spanTextClass) {
            return <span className={spanTextClass}>{title}</span>;
        } else if (img) {
            return <span>{img} {title}</span>;
        } else if (href) {
            return (
                <a href={href} target="_blank" rel="noreferrer" style={style}>
                    {title}
                </a>
            );
        } else {
            return title;
        }
    };
    return (
        <LoadingButton
            loading={loading}
            loadingIndicator={<CircularProgress />}
            id={id}
            fullWidth={fullWidth}
            className={classStyle}
            disabled={disabled}
            data-testid={testid}
            type={btnType}
            variant={variant}
            onClick={handleClick}
            style={style}
            autoFocus={autoFocus}
        >
            {renderContent()}
        </LoadingButton>
    )
}


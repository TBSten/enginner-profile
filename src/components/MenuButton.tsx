import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuProps } from "@mui/material";
import { FC, ReactNode, useRef } from "react";

interface MenuButtonProps extends MenuProps {
    icon?: ReactNode
    onOpen?: () => void
}
const MenuButton: FC<MenuButtonProps> = ({
    icon = <MoreVert />,
    onOpen,
    ...menuProps
}) => {
    const ref = useRef<HTMLButtonElement>(null)
    return (
        <>
            <IconButton ref={ref} onClick={onOpen}>
                {icon}
            </IconButton>
            <Menu anchorEl={ref.current} {...menuProps}>
            </Menu>
        </>
    );
}

export default MenuButton;
import { FC } from "react";
import { ProfViewComponentProps } from "./util";

type BadProfViewProps = ProfViewComponentProps & {}
const BadProfView: FC<BadProfViewProps> = ({ prof }) => {
    return (
        <div>Bad:{JSON.stringify(prof)}</div>
    );
}

export default BadProfView;
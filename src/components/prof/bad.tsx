import { Box } from "@mui/material";
import Image from "next/image";
import { FC } from "react";
import { ProfViewComponentProps } from "./util";

type BadProfViewProps = ProfViewComponentProps & {}
const BadProfView: FC<BadProfViewProps> = ({ prof }) => {
    return (
        <Box color={prof.theme.color} bgcolor={t => t.palette.background.paper}>
            <Image
                src={prof.icon}
                alt={prof.name}
                width={300}
                height={300}
                style={{ height: "auto" }}
                priority
            />
            <p>
                {prof.images.map(img =>
                    <Image
                        key={img}
                        src={img}
                        alt=""
                        width={100}
                        height={100}
                        style={{ height: "auto" }}
                        priority
                    />
                )}
            </p>
            <h1>{prof.name}</h1>
            <p>
                {prof.freeSpace}
            </p>
            <table>
                <tbody>
                    {prof.profItems.map(item =>
                        <tr key={item.name}>
                            <th>{item.name}</th>
                            <td>
                                {
                                    item.value.type === "text"
                                        ? item.value.text
                                        : <a href={item.value.link} target="_blank" rel="noreferrer">
                                            {item.value.link}
                                        </a>
                                }
                            </td>
                            <td>{item.comment}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h2>スキルと評価</h2>
            <ul>
                {prof.skills.map(skill =>
                    <li key={skill.name}>
                        {skill.name} ... {skill.assessment.value}/4 ({skill.assessment.comment})
                    </li>
                )}
            </ul>
        </Box>
    );
}

export default BadProfView;
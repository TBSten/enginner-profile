import { FC, useEffect, useReducer } from "react";

const OnlyClient = <Props extends {},>(Component: FC<Props>) => {
    const Comp: FC<Props> = (props) => {
        const [mounted, mount] = useReducer(() => true, false)
        useEffect(() => mount(), [])
        if (!mounted) return <></>
        return <Component {...props} />
    }
    return Comp
}

export default OnlyClient;

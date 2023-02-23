import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { Session, getServerSession } from "next-auth"

type ApiHandler<P = {}, R = ReturnType<NextApiHandler>> = (
    params: {
        req: NextApiRequest
        res: NextApiResponse
        query: Record<string, string>
        session: Session | null
        body: {}
    } & P,
) => R
interface ApiRouteArgs {
    onGet?: ApiHandler
    onPost?: ApiHandler
    onPut?: ApiHandler
    onDelete?: ApiHandler
    onError?: ApiHandler<{ error: unknown }>
}
export const apiRoute = ({
    onGet,
    onPost,
    onPut,
    onDelete,
    onError,
}: ApiRouteArgs): NextApiHandler => async (req, res) => {
    let session = null
    let query = {}
    let body = null
    try {
        const method = req.method
        session = await getServerSession(req, res, authOptions)
        query = req.query as Record<string, string>
        body = tryAndCatch(() => JSON.parse(req.body), (e) => null)
        if (method === "GET") {
            if (!onGet) return res.status(405).json({ msg: `method ${method} is not allowed` })
            return onGet({ req, res, query, session, body })
        } else if (method === "POST") {
            if (!onPost) return res.status(405).json({ msg: `method ${method} is not allowed` })
            return onPost({ req, res, query, session, body })
        } else if (method === "Put") {
            if (!onPut) return res.status(405).json({ msg: `method ${method} is not allowed` })
            return onPut({ req, res, query, session, body })
        } else if (method === "DELETE") {
            if (!onDelete) return res.status(405).json({ msg: `method ${method} is not allowed` })
            return onDelete({ req, res, query, session, body })
        }
        return res.status(405).json({
            msg: `invalid request method : ${method}`
        })
    } catch (error) {
        console.error("api route error")
        console.error(error)
        if (onError) return onError({ req, res, session, query, error, body })
        return res.status(500).json({
            msg: "internal server error"
        })
    }
}

const tryAndCatch = <T,>(callback: () => T, catchCallback: (e: unknown) => T) => {
    try {
        return callback()
    } catch (e) {
        return catchCallback(e)
    }
}


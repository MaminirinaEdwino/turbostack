import { useEffect, useState } from "react"
import { GoApp } from "../services/bridge"

export const useCheckToken = () => {
    const [subscription, setSubscription] = useState(null)
    useEffect(() => {
        const checkToken = async () => {
            const res = await GoApp.checkToken()
            setSubscription(res)
        }
        checkToken()
    }, [])

    return subscription
}
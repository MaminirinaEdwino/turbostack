import MainLayout from "../layouts/mainLayout";
import SubscriptionCard from "../components/subscriptionCard";
import LayoutHeader from "../components/layoutHeader";
import illustration from "../assets/subscriptionIllustration.svg"
import { useEffect, useState } from "react";
import { GoApp } from "../services/bridge";
import React from "react";
export default function Subscription() {
    const [toggleKeyModal, setToggleKeyModal] = useState(false)
    const [activationKey, setActivationKey] = useState("")
    const [subscription, setSubscription] = useState("free")
    const checkToken = async () => {
        const res = await GoApp.checkToken()
        setSubscription(res)
    }
    const saveToken = async () => {
        await GoApp.saveToken(activationKey)
        checkToken()
    }
    useEffect(() => {
        const checkToken = async () => {
            const res = await GoApp.checkToken()
            setSubscription(res)
        }
        checkToken()
    }, [])
    const subscriptionList = [
        // {
        //     name: "Free",
        //     illustration: illustration,
        //     text: "This include the basic functionnalities for beginners. But with limited access",
        //     price: "free"
        // },
        {
            name: "Pro",
            illustration: illustration,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem fugit nesciunt deserunt iusto. Architecto esse similique beatae deleniti quos vitae harum perspiciatis sapiente? Sed fugit saepe pariatur ducimus doloremque expedita.",
            price: "Activate"
        }
    ]
    return <MainLayout child={
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50/50 relative">
            {/* En-tête de la page */}
            <div className="sticky top-0 mt-2 bg-couleur3 pb-4 z-10">
                <LayoutHeader layoutName={"Subscription"} />
            </div>
            {/* Modale de la clé d'activation (Centrée, effet Backdrop flou et design épuré) */}
            <div className={
                "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 " +
                (!toggleKeyModal ? "hidden opacity-0 pointer-events-none" : "opacity-100")
            }>
                <div className="bg-couleur3 border border-couleur1/30 rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 flex flex-col gap-4 transform transition-all">
                    <div className="flex flex-col gap-1 text-center">
                        <h3 className="text-xl font-bold text-couleur1">Add your activation key</h3>
                        <p className="text-sm text-gray-500">Paste your subscription token below to activate your access.</p>
                    </div>

                    <textarea
                        placeholder="Paste key here..."
                        className="border border-couleur1/30 rounded-xl bg-gray-50/50 min-h-[160px] resize-none p-3 text-sm focus:outline-none focus:ring-2 focus:ring-couleur1/50 transition-all"
                        value={activationKey}
                        onChange={(e) => setActivationKey(e.target.value)}
                    />

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            className="px-5 py-2.5 rounded-xl text-couleur1 bg-white hover:bg-gray-100 border border-couleur1/30 text-sm font-medium transition-all"
                            onClick={() => setToggleKeyModal(false)}
                        >
                            Cancel
                        </button>

                        {activationKey !== "" && (
                            <button
                                className="px-5 py-2.5 rounded-xl bg-couleur1 text-white hover:opacity-90 text-sm font-medium shadow-md shadow-couleur1/20 transition-all"
                                onClick={() => {
                                    saveToken()
                                }}
                            >
                                Activate
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenu principal : État de l'abonnement ou Liste des offres */}
            <div className="mt-6">
                {subscription.expired === "false" && subscription.subscription != "free" ? (
                    <div className="bg-white border border-couleur1/20 rounded-2xl p-6 shadow-sm max-w-xl mx-auto flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b pb-4">
                            <span className="text-gray-500 font-medium">Actual subscription</span>
                            <span className="font-bold text-couleur1 px-3 py-1 bg-couleur1/10 rounded-full text-sm">
                                {subscription.subscription}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-500 font-medium">Start date</span>
                            <span className="text-gray-800 font-semibold">{subscription.iat}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-gray-500 font-medium">Expiration date</span>
                            <span className="text-gray-800 font-semibold">{subscription.exp}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6 mt-4">
                        {subscriptionList.map((item, id) => (
                            <React.Fragment key={item.name + "" + id}>
                                {item.name.toLowerCase() !== subscription.subscription && (
                                    <SubscriptionCard
                                        setTogglekeyModal={setToggleKeyModal}
                                        name={item.name}
                                        illustration={item.illustration}
                                        text={item.text}
                                        price={item.price}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </main>
    }></MainLayout>
}
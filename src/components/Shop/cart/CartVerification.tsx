import { Button, Input, Textarea } from "@heroui/react";
import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import { useState } from "react";
import CartDetail from "@components/Shop/cart/CartDetail.tsx";

export default function CartVerification() {
    const user = useSelector((state: RootState) => state.user);
    const [validateAddress, setValidateAddress] = useState(user.address);
    const [validateZipcode, setValidateZipcode] = useState(user.zipcode);
    const [validateCity, setValidateCity] = useState(user.city);
    const [validatePhone, setValidatePhone] = useState(user.phone);
    const [validateComplementaryInfo, setValidateComplementaryInfo] =
        useState("");

    console.log("user", user);
    const handleValidateCart = () => {
        //1.Mettre à jour l'addresse de livraison

        //2. Faire la requête de validation de commande en ajoutant les informations complémentaires dans le payload

        //3. Rediriger vers la page de confirmation de commande
        console.log("validate cart");
    };

    return (
        <div className="grid grid-cols-5 gap-4 items-start h-full">
            {/*Confirmation livraison*/}
            <div className="bg-white w-full col-span-3 p-5 rounded-2xl flex flex-col gap-3 shadow align-self: start">
                <h1 className="text-xl">Confirmation des informations</h1>
                <div className="flex gap-3">
                    <Input
                        type="text"
                        label="Adresse"
                        labelPlacement="outside"
                        isRequired={true}
                        value={validateAddress}
                        onChange={(e) => setValidateAddress(e.target.value)}
                    />
                    <Input
                        type="text"
                        label="Code postal"
                        labelPlacement="outside"
                        isRequired={true}
                        value={validateZipcode}
                        onChange={(e) => setValidateZipcode(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <Input
                        type="text"
                        label="Ville"
                        labelPlacement="outside"
                        isRequired={true}
                        value={validateCity}
                        onChange={(e) => setValidateCity(e.target.value)}
                    />
                    <Input
                        type="text"
                        label="Téléphone"
                        labelPlacement="outside"
                        isRequired={true}
                        value={validatePhone}
                        onChange={(e) => setValidatePhone(e.target.value)}
                    />
                </div>
                <Textarea
                    label="Informations complémentaires"
                    labelPlacement="outside"
                    value={validateComplementaryInfo}
                    minRows={5}
                    onChange={(e) =>
                        setValidateComplementaryInfo(e.target.value)
                    }
                />
            </div>

            {/*Confirmation panier*/}
            <div className="bg-white w-full col-span-2 p-5 rounded-2xl shadow flex flex-col justify-between self-stretch h-full space-y-5">
                <h1 className="text-3xl">Votre panier</h1>
                <CartDetail />
                <Button color="primary" size="lg" onPress={handleValidateCart}>
                    Valider la commande
                </Button>
            </div>
        </div>
    );
}

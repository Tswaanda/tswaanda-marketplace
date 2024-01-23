import emailjs from "@emailjs/browser";

export const reviewOnProductUpdate = async (rating: any, review: any, farmerInfo: any, product: any) => {
    try {
        let productUrl = `https://tswaanda.com/product/${product.id}`;
        const templateParams = {
            to_name: farmerInfo.fullName,
            to_user_email: farmerInfo.email,
            product_name: product.name,
            rating: rating,
            review_message: review,
            product_link: productUrl,
        };

        emailjs
            .send(
                "service_bsld0fh",
                "template_01vnmhr",
                templateParams,
                "cEuqVJj0eDt8tfwPN"
            )
            .then(
                (result) => {
                    console.log("SUCCESS!", result.status, result.text);
                    console.log("message was sent");
                },
                (error) => {
                    console.log("FAILED...", error);
                }
            );
        return true;
    } catch (error) {
        console.log("error sending email", error)
    }
};
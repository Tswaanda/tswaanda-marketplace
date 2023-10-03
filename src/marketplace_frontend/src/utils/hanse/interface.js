response = await contract.accept_issuer_offer({
    id: {
        Cargo: 1n
    },
    country: "GER",
    inspection_check: false
})
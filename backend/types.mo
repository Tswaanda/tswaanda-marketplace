import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import List "mo:base/List";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";

module {

    // Types for products products
    public type Product = {
        id : Text;
        name : Text;
        hscode : Text;
        farmer : Text;
        price : Int32;
        minOrder : Int32;
        shortDescription : Text;
        fullDescription : Text;
        category : Text;
        images : [Text];
        weight : Int32;
        ordersPlaced : Int32;
        availability : Text;
        created : Int;
    };

    // Types for Orders
    public type Order = {
        orderId : Text;
        orderNumber : Text;
        userEmail : Text;
        orderProducts : OrderProduct;
        orderOwner : Principal;
        subtotal : Float;
        totalPrice : Float;
        shippingEstimate : Float;
        taxEstimate : Float;
        status : Text;
        dateCreated : Int;
        step : Nat;
        companyName : Text;
        name : Text;
        companyAddress : Text;
        companyAddress2 : Text;
        companyCountry : Text;
        billTo : Text;
        clientName : Text;
        clientAddress : Text;
        clientAddress2 : Text;
        clientCountry : Text;
        invoiceTitleLabel : Text;
        invoiceTitle : Text;
        invoiceDateLabel : Text;
        invoiceDate : Text;
        invoiceDueDateLabel : Text;
        invoiceDueDate : Text;
        exportDocs: [Text];
        shipmentDocs: [Text];
        exportDocsVerified: Bool;
        shipmentDocsVerified: Bool;
        invoiceStatus : {
            #paid;
            #unpaid;
            #overdue;
        };
        orderStage : {
            #orderplaced;
            #purchased;
            #shipped;
            #delivered;
            #cancelled;
        };
        productLineDescription : Text;
        productLineQuantity : Text;
        productLineQuantityRate : Text;
        productLineQuantityAmount : Text;
        productLines : {
            description : Text;
            quantity : Text;
            rate : Text;
        };
        subTotalLabel : Text;
        taxLabel : Text;
        totalLabel : Text;
        currency : Text;
        notesLabel : Text;
        notes : Text;
        termLabel : Text;
    };

    public type OrderProduct = {
        id : Text;
        name : Text;
        description : Text;
        image : Text;
        quantity : Nat;
        price : Float;
    };

    // Types for the KYC methods
    public type Customer = {
        id : Text;
        principal : Principal;
        body : ?CustomerBody;
        created : Int;
    };

    type CustomerBody = {
        userName : Text;
        firstName : Text;
        lastName : Text;
        about : Text;
        email : Text;
        organization : Text;
        country : Text;
        streetAddress : Text;
        city : Text;
        province : Text;
        zipCode : Nat;
        phoneNumber : Nat;
        profilePhoto : Text;
        kycIDCopy : Text;
        proofOfAddressCopy : Text;
        status : Text;
        isUpdated : Bool;
        isEmailVerified : Bool;
        membershipLevel : Text;
        userWebsite : Text;
        pushNotification : {
            email : Bool;
            sms : Bool;
            everything : Bool;
        };
    };

    // Types for cart Items
    public type CartItem = {
        id : Text;
        quantity : Nat;
        dateCreated : Int;
    };

    public type EmailVerificationSchema = {
        userId : Text;
        userPrincipal : Principal;
        hashedUniqueString : Text;
        created : Int;
        expires : Int;
    };

    public type NewsLetterSubscription = {
        id : Text;
        email : Text;
        isVerified : Bool;
        created : Int;
    };

    public type Stats = {
        totalOrders : Nat;
        totalCustomers : Nat;
    };

    // Admin Types

    public type Farmer = {
        id : Text;
        fullName : Text;
        email : Text;
        phone : Text;
        farmName : Text;
        location : Text;
        description : Text;
        listedProducts : [Text];
        soldProducts : [Text];
        produceCategories : Text;
        proofOfAddress : ?Text;
        idCopy : ?Text;
        isVerified : Bool;
        isSuspended : Bool;
        created : Int;
    };

};

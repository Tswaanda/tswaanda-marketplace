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
        hscode: Text;
        farmer: Text;
        price : Int32;
        minOrder : Int32;
        shortDescription : Text;
        fullDescription : Text;
        category : Text;
        images : [Text];
        weight : Int32;
        ordersPlaced : Int32;
        availability : Text;
        created: Int;
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
        // invoice: ?Text;
        // acceptedOn: ?Int;
        // shippedOn: ?Int;
        // deliveredOn: ?Int;
        dateCreated : Int;
        step : Nat;
    };

    // -----------------------ORDER TYPES FOR MULTIPLE PRODUCTS PER ORDER-----------------------------------------
    // public type Order = {
    //     orderId : Text;
    //     orderNumber: Text;
    //     userEmail: Text;
    //     orderProducts: [OrderProduct];
    //     orderOwner: Principal;
    //     subtotal: Float;
    //     totalPrice: Float;
    //     shippingEstimate: Float;
    //     taxEstimate: Float;
    //     status: Text;
    //     step: Nat;
    //     dateCreated: Int;
    // };

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
        userId : Principal;
        userName : Text;
        firstName : Text;
        lastName : Text;
        about : Text;
        email : Text;
        organization : Text;
        country : Text;
        streetAdrees : Text;
        city : Text;
        province : Text;
        zipCode : Nat;
        phoneNumber : Nat;
        profilePhoto : Text;
        kycIDCopy : Text;
        proofOfAddressCopy : Text;
        status : Text;
        dateCreated : Int;
        isUpdated : Bool;
        isEmailVerified : Bool;
        membershipLevel : Text;
        userWebsite : Text;
        isFarmer : Bool;
        isBuyer : Bool;
        isStaff : Bool;
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
        id: Text;
        email: Text;
        isVerified: Bool;
        created: Int;
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
        idCopy: ?Text;
        isVerified : Bool;
        isSuspended : Bool;
        created : Int;
    };

};

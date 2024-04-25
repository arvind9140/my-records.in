export const onlyAlphabetsValidation = (NameToCheck) => {
    let regex = /^[A-Za-z _]*$/;
    return regex.test(NameToCheck);
};

export const onlyEmailValidation = (emailforValidation) => {
    if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailforValidation)
    ) {
        return true;
    }
    return false;
};

export const onlyPasswordPatternValidation = (pass_word) => {
    let passwordCheck = new RegExp(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,25}$/
    );
    if (passwordCheck.test(pass_word)) {
        return true;
    }
    return false;
};

export const onlyNumberValidation = (num_ber) => {
    // Updated regular expression with length constraint
    let Number = /^-?\d+(\.\d+)?$/;

    if (Number.test(num_ber)) {
        return true;
    }
    return false;
};

export const onlyDateOfBirthValidation = (dob) => {
    let dobRegex = /^(0[1-9]|[1-2]\d|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;

    if (dobRegex.test(dob)) {
        return true;
    }
    return false;
}



export const onlyAddressValidation = (address) => {
    // Updated regular expression to ensure address starts with a character or digit and doesn't start with a space
    const addressRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s,'-.]*$/;

    if (addressRegex.test(address)) {
        return true;
    }
    return false;
}
export const onlyBloodGroupValidation = (Blood) => {
    const bloodGroupRegex = /^(A|B|AB|O)[+-]$/;



    if (bloodGroupRegex.test(Blood)) {
        return true;
    }
    return false;

}





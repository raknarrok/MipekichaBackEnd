export const generateUserErrorInfo = (user) => {

    return `
    Some values are missing or invalid
    - First Name: ${user.first_name}
    - Last Name: ${user.last_name}
    - Email: ${user.email}
    - Age: ${user.age}
    - Cart: ${user.cart}
    - Role: ${user.role}
    `
}

export const generateProductErrorInfo = (product) => {

    return `
    Some values are missing or invalid
    - Title: ${product?.title}
    - Description: ${product?.description}
    - Price: ${product?.price}
    - Code: ${product?.code}
    - Stock: ${product?.stock}
    - Category: ${product?.category}
    - StatusItem: ${product?.statusItem}
    `
}

export const generateMailTrackerErrorInfo = (mailTracker) => {

    return `
        Some values are missing or invalid
        - Email: ${mailTracker?.to}
        - Subject: ${mailTracker?.subject}
        `
}

export const generateNotFoundById = (pid) => {

    return `
        Element with ID ${pid} not found
        `
}

export const generateEmptyError = (eid, data) => {

    return `
        Missing data provided
        - Id: ${eid}
        - Data: ${data}
    `
}
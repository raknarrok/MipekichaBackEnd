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
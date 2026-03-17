export const formatAddress = (addr: any) => {
    return [
        addr.apartment_suite,
        addr.street_address,
        addr.city,
        addr.state_province,
        addr.postal_code,
        addr.country,
    ]
        .filter(Boolean)
        .join(", ");
};
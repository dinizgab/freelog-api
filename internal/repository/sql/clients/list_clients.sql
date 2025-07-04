SELECT
    id,
    company_name,
    contact_name,
    contact_title,
    email,
    phone,
    address,
    notes,
    is_active
FROM
    clients
WHERE
    freelancer_id = $1

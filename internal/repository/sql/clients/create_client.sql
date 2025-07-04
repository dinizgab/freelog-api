insert into clients (
    company_name,
    contact_name,
    contact_title,
    email,
    phone,
    address,
    notes,
    is_active,
    freelancer_id
) values (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9
) 

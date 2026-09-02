export type RoleName = 
    | 'super_admin'
    | 'vendedor'
    | 'desarrollador'
    | 'disenador'
    | 'qa_tester'
    | 'validador';

export type IndustryType = 
    | 'mineria'
    | 'medio_ambiente'
    | 'comercio'
    | 'servicios'
    | 'otro';

export type QuoteStatus = 
    | 'draft'
    | 'sent'
    | 'under_review'
    | 'accepted'
    | 'rejected'
    | 'expired';

export type ProjectStatus = 
    | 'pending_start'
    | 'in_development'
    | 'testing_validation'
    | 'delivered'
    | 'paused'
    | 'cancelled';

export type ProjectPriority = 
    | 'low'
    | 'medium'
    | 'high'
    | 'critical';

export type TicketStatus = 
    | 'backlog'
    | 'todo'
    | 'in_progress'
    | 'testing_qa'
    | 'validated'
    | 'done';

export type TicketType = 
    | 'feature'
    | 'bug'
    | 'integration'
    | 'infrastructure'
    | 'design';

export type TicketPriority = 
    | 'low'
    | 'medium'
    | 'high'
    | 'urgent';

export interface Role {
    id: number;
    name: RoleName;
    display_name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
    is_active: boolean;
    roles?: Role[];
    created_at: string;
    updated_at: string;
}

export interface Client {
    id: number;
    user_id?: number | null;
    created_by?: number | null;
    company_name: string;
    contact_name: string;
    email: string;
    phone?: string | null;
    industry: IndustryType;
    cuit_tax_id?: string | null;
    address?: string | null;
    notes?: string | null;
    user?: User | null;
    creator?: User | null;
    quotes?: Quote[];
    projects?: Project[];
    created_at: string;
    updated_at: string;
}

export interface SoftwareType {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    base_hours_dev: number;
    base_hours_qa: number;
    base_price_infrastructure: number;
    is_active: boolean;
    sort_order: number;
    features?: Feature[];
    created_at: string;
    updated_at: string;
}

export interface Feature {
    id: number;
    software_type_id?: number | null;
    category: string;
    name: string;
    slug: string;
    description: string | null;
    hours_dev: number;
    hours_integration: number;
    hours_testing_qa: number;
    total_hours?: number;
    cost_setup_infra: number;
    cost_monthly_infra: number;
    is_preset_mining: boolean;
    is_preset_environment: boolean;
    is_preset_commerce: boolean;
    is_preset_industry: boolean;
    is_preset_services: boolean;
    is_recommended: boolean;
    feasibility_status?: 'verde' | 'amarillo' | 'rojo' | string;
    feasibility_condition?: string | null;
    contingency_script?: string | null;
    is_active: boolean;
    software_type?: SoftwareType | null;
    created_at: string;
    updated_at: string;
}

export interface QuoteItem {
    id: number;
    quote_id: number;
    feature_id?: number | null;
    category: string;
    name: string;
    description?: string | null;
    hours_dev: number;
    hours_integration: number;
    hours_testing_qa: number;
    total_hours: number;
    cost_setup_infra: number;
    cost_monthly_infra: number;
    price: number;
    feature?: Feature | null;
    created_at: string;
    updated_at: string;
}

export interface CommercialPack {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    target_audience?: string | null;
    total_hours: number;
    price_min_usd: number;
    price_max_usd: number;
    monthly_maintenance_usd: number;
    is_active: boolean;
    sort_order: number;
    features?: (Feature & { pivot?: { is_mandatory: boolean } })[];
    created_at?: string;
    updated_at?: string;
}

export interface Quote {
    id: number;
    quote_number: string;
    client_id: number;
    software_type_id: number;
    created_by: number;
    pack_id?: number | null;
    title: string;
    preset_used?: 'mineria' | 'medio_ambiente' | 'comercio' | 'industria' | 'servicios' | 'personalizado' | string | null;
    status: QuoteStatus;
    currency: string;
    hourly_rate: number;
    total_hours_dev: number;
    total_hours_integration: number;
    total_hours_qa: number;
    total_hours: number;
    subtotal_development: number;
    subtotal_infrastructure_setup: number;
    subtotal_infrastructure_monthly: number;
    discount_percentage: number;
    discount_amount: number;
    total_amount: number;
    team_capacity_hours_per_day: number;
    estimated_business_days: number;
    estimated_start_date?: string | null;
    estimated_delivery_date?: string | null;
    notes?: string | null;
    terms_conditions?: string | null;
    accepted_at?: string | null;
    rejected_at?: string | null;
    rejection_reason?: string | null;
    valid_until?: string | null;
    client?: Client;
    software_type?: SoftwareType;
    creator?: User;
    commercial_pack?: CommercialPack | null;
    items?: QuoteItem[];
    project?: Project | null;
    comments?: Comment[];
    attachments?: Attachment[];
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    quote_id?: number | null;
    client_id: number;
    manager_id?: number | null;
    code: string;
    name: string;
    description?: string | null;
    status: ProjectStatus;
    priority: ProjectPriority;
    start_date?: string | null;
    due_date?: string | null;
    delivered_at?: string | null;
    progress_percentage: number;
    quote?: Quote | null;
    client?: Client;
    manager?: User | null;
    tickets?: Ticket[];
    comments?: Comment[];
    attachments?: Attachment[];
    created_at: string;
    updated_at: string;
}

export interface TicketAssignment {
    id: number;
    ticket_id: number;
    user_id: number;
    role_in_ticket: 'desarrollador' | 'disenador' | 'qa_tester' | 'validador';
    assigned_at: string;
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface Ticket {
    id: number;
    project_id: number;
    quote_item_id?: number | null;
    ticket_number: string;
    title: string;
    description?: string | null;
    status: TicketStatus;
    type: TicketType;
    priority: TicketPriority;
    estimated_hours: number;
    logged_hours: number;
    sort_order: number;
    project?: Project;
    quote_item?: QuoteItem | null;
    assignments?: TicketAssignment[];
    assignees?: User[];
    comments?: Comment[];
    attachments?: Attachment[];
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    user_id: number;
    commentable_type: string;
    commentable_id: number;
    content: string;
    is_internal: boolean;
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface Attachment {
    id: number;
    user_id: number;
    attachable_type: string;
    attachable_id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    user?: User;
    created_at: string;
    updated_at: string;
}

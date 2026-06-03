/**
 * Partnerships Service
 *
 * Business logic for partnership inquiry lifecycle management.
 * Designed for future email integration without schema changes —
 * email hooks are clearly marked and can be wired to any provider
 * (SendGrid, Resend, AWS SES) by implementing the commented stubs.
 */

import { db } from '../database';
import { ApiError } from '../utils/ApiError';
import type { CreatePartnershipInput, UpdatePartnershipStatusInput, PartnershipStatus } from '../validators/partnerships.validator';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PartnershipInquiry {
  id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  partnership_type: string;
  message: string;
  status: PartnershipStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  // Joined activity timeline (optional)
  activity?: PartnershipActivity[];
}

export interface PartnershipActivity {
  id: string;
  inquiry_id: string;
  action: string;
  created_at: string;
}

export interface PartnershipStats {
  total: number;
  new: number;
  contacted: number;
  in_discussion: number;
  approved: number;
  rejected: number;
  closed: number;
}

// ─── Email Hook Stub ───────────────────────────────────────────────────────────
// Future: replace with actual provider calls (e.g. Resend, SendGrid).

async function sendNotification(event: 'inquiry_received' | 'approved' | 'rejected', inquiry: PartnershipInquiry): Promise<void> {
  // TODO: Implement email notifications
  // Example integration point:
  // if (event === 'inquiry_received') {
  //   await emailProvider.send({
  //     to: inquiry.email,
  //     subject: 'We received your partnership inquiry',
  //     template: 'partnership-received',
  //     data: { organization_name: inquiry.organization_name }
  //   });
  // }
  void event;
  void inquiry;
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const partnershipsService = {

  /**
   * Get all inquiries with optional activity timeline — admin only.
   */
  async getAll(): Promise<PartnershipInquiry[]> {
    const inquiries = await db.query<PartnershipInquiry>(
      `SELECT * FROM partnership_inquiries ORDER BY created_at DESC`
    );
    if (inquiries.length === 0) return [];

    // Batch load all activity records
    const ids = inquiries.map(i => i.id);
    const activities = await db.query<PartnershipActivity>(
      `SELECT * FROM partnership_activity WHERE inquiry_id = ANY($1) ORDER BY created_at ASC`,
      [ids]
    );

    inquiries.forEach(inquiry => {
      inquiry.activity = activities.filter(a => a.inquiry_id === inquiry.id);
    });

    return inquiries;
  },

  /**
   * Get a single inquiry by ID with its activity timeline — admin only.
   */
  async getById(id: string): Promise<PartnershipInquiry> {
    const rows = await db.query<PartnershipInquiry>(
      `SELECT * FROM partnership_inquiries WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) throw new ApiError(404, 'Partnership inquiry not found.');

    const inquiry = rows[0];
    inquiry.activity = await db.query<PartnershipActivity>(
      `SELECT * FROM partnership_activity WHERE inquiry_id = $1 ORDER BY created_at ASC`,
      [id]
    );

    return inquiry;
  },

  /**
   * Create a new partnership inquiry (public form submission).
   * Records initial activity. Fires email hook stub.
   */
  async create(input: CreatePartnershipInput): Promise<PartnershipInquiry> {
    const rows = await db.query<PartnershipInquiry>(
      `INSERT INTO partnership_inquiries
        (organization_name, contact_person, email, phone, partnership_type, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        input.organization_name,
        input.contact_person,
        input.email,
        input.phone || null,
        input.partnership_type,
        input.message,
      ]
    );

    const inquiry = rows[0];

    // Log initial activity
    await db.query(
      `INSERT INTO partnership_activity (inquiry_id, action) VALUES ($1, $2)`,
      [inquiry.id, 'Inquiry submitted']
    );

    // Email hook — inquiry received notification
    await sendNotification('inquiry_received', inquiry);

    inquiry.activity = [{ id: '', inquiry_id: inquiry.id, action: 'Inquiry submitted', created_at: inquiry.created_at }];
    return inquiry;
  },

  /**
   * Update status and/or internal notes — admin only.
   * Records activity for every status transition.
   */
  async updateStatus(id: string, input: UpdatePartnershipStatusInput): Promise<PartnershipInquiry> {
    // Fetch current state to detect status change
    const current = await db.query<{ status: string }>(
      `SELECT status FROM partnership_inquiries WHERE id = $1`,
      [id]
    );
    if (current.length === 0) throw new ApiError(404, 'Partnership inquiry not found.');

    const rows = await db.query<PartnershipInquiry>(
      `UPDATE partnership_inquiries
       SET status         = COALESCE($1, status),
           internal_notes = COALESCE($2, internal_notes),
           updated_at     = NOW()
       WHERE id = $3
       RETURNING *`,
      [
        input.status ?? null,
        input.internal_notes !== undefined ? input.internal_notes : null,
        id,
      ]
    );

    const updated = rows[0];

    // Log activity only if status actually changed
    if (input.status && input.status !== current[0].status) {
      await db.query(
        `INSERT INTO partnership_activity (inquiry_id, action) VALUES ($1, $2)`,
        [id, `Status changed to "${input.status}"`]
      );

      // Email hook — approval/rejection notifications
      if (input.status === 'Approved') {
        await sendNotification('approved', updated);
      } else if (input.status === 'Rejected') {
        await sendNotification('rejected', updated);
      }
    }

    // Return with full timeline
    return this.getById(id);
  },

  /**
   * Aggregate statistics for dashboard cards.
   */
  async getStats(): Promise<PartnershipStats> {
    const rows = await db.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) as count FROM partnership_inquiries GROUP BY status`
    );

    const map: Record<string, number> = {};
    rows.forEach(r => { map[r.status] = parseInt(r.count, 10); });

    const totalRow = await db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM partnership_inquiries`
    );

    return {
      total:         parseInt(totalRow[0]?.count || '0', 10),
      new:           map['New']           || 0,
      contacted:     map['Contacted']     || 0,
      in_discussion: map['In Discussion'] || 0,
      approved:      map['Approved']      || 0,
      rejected:      map['Rejected']      || 0,
      closed:        map['Closed']        || 0,
    };
  },
};

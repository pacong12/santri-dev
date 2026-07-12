import { Injectable, BadRequestException } from '@nestjs/common';
import { 
  PrismaTenantRepository, 
  PrismaAuditLogRepository,
  PrismaTransaksiRepository,
  PrismaPlatformSettingRepository
} from '@org/database';
import { 
  TenantStatus,
  CreateTenantUseCase, 
  UpdateTenantUseCase, 
  UpdateTenantStatusUseCase, 
  ArchiveTenantUseCase,
  GetTenantsUseCase,
  GetTenantDetailsUseCase
} from '@org/domain-tenant';
import { GetGlobalAuditLogsUseCase } from '@org/domain-user';
import { GetGlobalTransactionsUseCase } from '@org/domain-transaksi';
import { 
  GetSettingsUseCase, 
  UpdateSettingsUseCase, 
  GetDashboardStatsUseCase 
} from '@org/domain-platform';
import { bigintToNumber } from '@org/shared-utils';

@Injectable()
export class SuperadminService {
  // Concrete Repositories
  private readonly tenantRepo = new PrismaTenantRepository();
  private readonly auditLogRepo = new PrismaAuditLogRepository();
  private readonly transaksiRepo = new PrismaTransaksiRepository();
  private readonly settingRepo = new PrismaPlatformSettingRepository();

  // Tenant Domain Use Cases
  private readonly createTenantUseCase: CreateTenantUseCase;
  private readonly updateTenantUseCase: UpdateTenantUseCase;
  private readonly updateTenantStatusUseCase: UpdateTenantStatusUseCase;
  private readonly archiveTenantUseCase: ArchiveTenantUseCase;
  private readonly getTenantsUseCase: GetTenantsUseCase;
  private readonly getTenantDetailsUseCase: GetTenantDetailsUseCase;

  // User Domain Use Cases
  private readonly getGlobalAuditLogsUseCase: GetGlobalAuditLogsUseCase;

  // Transaksi Domain Use Cases
  private readonly getGlobalTransactionsUseCase: GetGlobalTransactionsUseCase;

  // Platform Domain Use Cases
  private readonly getSettingsUseCase: GetSettingsUseCase;
  private readonly updateSettingsUseCase: UpdateSettingsUseCase;
  private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase;

  constructor() {
    // Tenant Injections
    this.createTenantUseCase = new CreateTenantUseCase(this.tenantRepo, this.auditLogRepo);
    this.updateTenantUseCase = new UpdateTenantUseCase(this.tenantRepo, this.auditLogRepo);
    this.updateTenantStatusUseCase = new UpdateTenantStatusUseCase(this.tenantRepo, this.auditLogRepo);
    this.archiveTenantUseCase = new ArchiveTenantUseCase(this.tenantRepo, this.auditLogRepo);
    this.getTenantsUseCase = new GetTenantsUseCase(this.tenantRepo);
    this.getTenantDetailsUseCase = new GetTenantDetailsUseCase(this.tenantRepo, this.transaksiRepo, this.auditLogRepo);

    // User Injections
    this.getGlobalAuditLogsUseCase = new GetGlobalAuditLogsUseCase(this.auditLogRepo);

    // Transaksi Injections
    this.getGlobalTransactionsUseCase = new GetGlobalTransactionsUseCase(this.transaksiRepo);

    // Platform Injections
    this.getSettingsUseCase = new GetSettingsUseCase(this.settingRepo);
    this.updateSettingsUseCase = new UpdateSettingsUseCase(this.settingRepo, this.auditLogRepo, this.tenantRepo);
    this.getDashboardStatsUseCase = new GetDashboardStatsUseCase(this.tenantRepo, this.transaksiRepo);
  }

  /**
   * Retrieves list of all active tenants.
   */
  async getTenants() {
    try {
      return await this.getTenantsUseCase.execute();
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Creates a new tenant and generates an audit log entry.
   */
  async createTenant(
    data: {
      name: string;
      code: string;
      phone?: string;
      address?: string;
      emailOfficial?: string;
      defaultDueDays?: number;
      bankName?: string;
      bankAccountNumber?: string;
      bankAccountName?: string;
      gatewayAccountId?: string;
    },
    userId: string
  ) {
    try {
      return await this.createTenantUseCase.execute({
        tenantData: data,
        adminUserId: userId,
      });
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Updates activation status for a tenant.
   */
  async updateTenantStatus(id: string, status: TenantStatus, userId: string) {
    try {
      return await this.updateTenantStatusUseCase.execute({
        tenantId: id,
        status,
        adminUserId: userId,
      });
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Updates detail information for a tenant.
   */
  async updateTenant(
    id: string,
    data: {
      name: string;
      code: string;
      phone?: string;
      address?: string;
      emailOfficial?: string;
      defaultDueDays?: number;
      bankName?: string;
      bankAccountNumber?: string;
      bankAccountName?: string;
      gatewayAccountId?: string;
    },
    userId: string
  ) {
    try {
      return await this.updateTenantUseCase.execute({
        tenantId: id,
        tenantData: data,
        adminUserId: userId,
      });
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Retrieves institutional metadata, transactional volume totals, and logs.
   */
  async getTenantDetails(id: string) {
    try {
      return await this.getTenantDetailsUseCase.execute({ tenantId: id });
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Soft-deletes a tenant and logs the administrative audit trail.
   */
  async deleteTenant(id: string, userId: string) {
    try {
      return await this.archiveTenantUseCase.execute({
        tenantId: id,
        adminUserId: userId,
      });
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Retrieves overview analytics and transaction listings for superadmin dashboard.
   */
  async getDashboardStats() {
    try {
      return await this.getDashboardStatsUseCase.execute();
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Fetches platform-wide settings configuration.
   */
  async getSettings() {
    try {
      const setting = await this.getSettingsUseCase.execute();
      return {
        id: setting.id,
        transactionFee: bigintToNumber(setting.transactionFee),
        updatedAt: setting.updatedAt,
      };
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Modifies transactional pricing settings and tracks change logs.
   */
  async updateSettings(transactionFee: number, userId: string) {
    try {
      const setting = await this.updateSettingsUseCase.execute({
        transactionFee,
        adminUserId: userId,
      });
      return {
        id: setting.id,
        transactionFee: bigintToNumber(setting.transactionFee),
        updatedAt: setting.updatedAt,
      };
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Retrieves server-side filtered and paginated global audit records.
   */
  async getAuditLogs(pageRaw?: string, limitRaw?: string, search?: string, action?: string) {
    try {
      return await this.getGlobalAuditLogsUseCase.execute({
        pageRaw,
        limitRaw,
        search,
        action,
      });
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Retrieves server-side filtered and paginated platform transaction records.
   */
  async getTransactions(pageRaw?: string, limitRaw?: string, search?: string, status?: string) {
    try {
      return await this.getGlobalTransactionsUseCase.execute({
        pageRaw,
        limitRaw,
        search,
        status,
      });
    } catch (error) {
      const err = error as Error;
      throw new BadRequestException(err.message);
    }
  }
}

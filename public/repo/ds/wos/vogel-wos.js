
var {ExcelDateToJSDate} = require('../../tools/box/xltools.js')
/* Service Item File ////////////////////////////////////////////////////////

*////////////////////////////////////////////////////////////////////////////
/* TEMPLATE
  WorkOrderNumber: '',
  OrderDate: '1970-01-01T00:00:00Z',
  TakenBy: '',
  CustomerCode: '',
  PurchaseOrderNumber: '',
  WorkOrderCategory: '1',
  ReferenceNumber: '',
  BillType: 'B',
  JobAddressLine1: '',
  JobAddressLine2: '',
  JobAddressLine3: '',
  ContactName: '',
  PhoneNumber: '',
  TerritoryMap: '',
  TechnicianID: '',
  SalesCategoryCode: '',
  Estimator: '',
  Supervisor: '',
  WOStatusCode: '',
  ScheduledForTechnician: '',
  IncludeBillTo: 'N',
  CompletelyBilled: 'N',
  QuotedPrice: 0,
  LabourRateTable: '',
  EquipmentRateTable: '',
  TravelMUTable: '',
  SalesTaxApplicable: 'E',
  FederalTaxApplicable: 'N',
  BillLabour: 'D',
  BillMaterial: 'D',
  ScheduleTime: '',
  DMSNumber: '',
  BillToCode: '',
  DateQuoted: '1970-01-01T00:00:00Z',
  ScheduledDate: '1970-01-01T00:00:00Z',
  DateCompleted: '1970-01-01T00:00:00Z',
  DateBillPrepared: '1970-01-01T00:00:00Z',
  ApprovedForBillingDate: '1970-01-01T00:00:00Z',
  BillingDate: '1970-01-01T00:00:00Z',
  InvoiceNumber: '',
  TimeOfCall: '',
  ApprovedBy: '',
  JobNumber: '',
  CostItem: '',
  EquipmentNumber: '',
  PrintedYetDaily: 'N',
  WorkOrderTicketPrinted: 'N',
  ServiceContractNumber: '',
  LineNumber: '',
  VehicleIdentificationNumber: '',
  SourceOfCallCode: '',
  DispatchPriority: '',
  DispatchEstimatedHours: 0,
  DispatchNumber: '',
  ARSubledgerCode: '',
  Filler2: '',
  PlymouthQFlag: '',
  PaymentTerms: '',
  TimeArrived: '',
  OrderTime: '',
  MainTechnicianID: '',
  MainOccupation: '',
  MainEstimatedHours: 0,
  AlternateTechnicianID1: '',
  AlternateOccupation1: '',
  AlternateEstimatedHours1: 0,
  AlternateTechnicianID2: '',
  AlternateOccupation2: '',
  AlternateEstimatedHours2: 0,
  AlternateTechnicianID3: '',
  AlternateOccupation3: '',
  AlternateEstimatedHours3: 0,
  AlternateTechnicianID4: '',
  AlternateOccupation4: '',
  AlternateEstimatedHours4: 0,
  SubTerritory: '',
  DispatchDate: '1970-01-01T00:00:00Z',
  DispatchTime: '',
  ArrivalDate: '1970-01-01T00:00:00Z',
  ArrivalTime: '',
  ScheduledCompletionDate: '1970-01-01T00:00:00Z',
  ScheduledCompletionTime: '',
  CompletedTime: '',
  ClosedDate: '1970-01-01T00:00:00Z',
  PagedDate: '1970-01-01T00:00:00Z',
  TimePaged: '',
  Margin: '',
  Filler3: '',
  FlatRateBook: '',
  PriceLevel: '',
  TerritorySalespersonCode: '',
  ProvinceStateCode: '',
  SpareNewCentury: '',
  CityCountyCode: '',
  WCBCode: '',
  TaxExemptionNumber: '',
  SalesTaxGroup: '',
  WorkInProgressMarkup: 0,
  EquipmentMarkupTable: '',
  DateRevised: '1970-01-01T00:00:00Z',
  TimeRevised: '',
  RevisedBy: '',
  Spare1: '',
  Spare2: '',
  Spare3: '',
  Spare4: '',
  Spare5: '',
  Spare6: '',
  Spare7: '',
  Spare8: '',
  Spare9: '',
  Spare10: '',
  TestResult: '',
  PurchaseAgreement: '',
  PurchaseAgreementItemNumber: '',
  APSubledgerCode: '',
  Filler5: '',
  MobileSignatureFileName: '',
  MobileBoardRecordPrimaryKey: '',
  MobileWorkOrder: '',
  MobileQuote: '',
  MobileAdjustmentHours: 0,
  LocationRequestDate: '1970-01-01T00:00:00Z',
  UpdateToCarrier: 'N',
  MobileSignatureName: '',
  SalesForceCode: '',
  QuoteStatus: '',
  NewPurchaseOrderNumber: '',
  MasterOrSlave: '',
  MasterWorkOrder: '',
  Division: '',
  BillEquipment: 'D',
  BillTravel: 'D',
  BillOther: 'D',
  CertifiedPayrollRequired: 'N',
  LastCertifiedPayrollNumber: '',
  ContactNumber: '',
  WageDescriptionNumber: '',
  FinalCertifiedPayroll: 'N',
  MobileBilling: '',
  MobileApprovedBilling: '1970-01-01T00:00:00Z',
  InvoiceDMSNumber: '',
  CertificationType: '',
  ComponentCode: '',
  WhContractAgency: '',
  MergeQuoteIntoPrepbill: 'N',
  CRMQuotationNumber: '',
  RevisionNumber: '',
  ShipToCode: '',
  WasMobileBilled: 'N',
  LastInvoiceNumber: '',
  ARTermsCode: '',
  XOIURL: ''
*/

​​​​/* REAL DATA
  ARSubledgerCode: "AR"
  ApprovedForBillingDate: "null"
  ArrivalDate: "2022-11-04T00:00:00Z"
  BillEquipment: "D"
  BillLabour: "D"
  BillMaterial: "D"
  BillOther: "D"
  BillTravel: "D"
  BillType: "F"
  BillingDate: "null"
  CertifiedPayrollRequired: "N"
  CompletelyBilled: "N"
  ContactName: "JOE"
  CustomerCode: "VOJO05"
  DateBillPrepared: "null"
  DateQuoted: "null"
  DispatchPriority: "10"
  EquipmentRateTable: "MASTER"
  FinalCertifiedPayroll: "N"
  FlatRateBook: "RES"
  IncludeBillTo: "N"
  JobAddressLine1: "4511 MAGNOLIA"
  JobAddressLine3: "ST. LOUIS, MO            63110"
  LabourRateTable: "MASTER"
  MainOccupation: "STECH"
  MainTechnicianID: "  184"
  MergeQuoteIntoPrepbill: "N"
  OrderDate: "2022-11-04T00:00:00Z"
  OrderTime: "1327"
  PhoneNumber: "314-799-4760"
  PriceLevel: "CLA"
  ProvinceStateCode: "MO"
  SalesCategoryCode: "       300"
  SalesTaxApplicable: "E"
  SalesTaxGroup: "MOMONTX"
  ScheduleTime: "0800A00"
  ScheduledDate: "2022-12-09T00:00:00Z"
  ScheduledForTechnician: "202212090800A0"
  ServiceContractNumber: "1933-2"
  TakenBy: "STRSA"
  TechnicianID: "476"
  TerritoryMap: "TEST"
  TerritorySalespersonCode: "HSE"
  TimeArrived: "0230"
  TimeOfCall: "1:27pm"
  TravelMUTable: "MASTER"
  UpdateToCarrier: "N"
  WOStatusCode: "O"
  WasMobileBilled: "N"
  WorkOrderCategory: "6"
  WorkOrderNumber: "00025796"
*/

var awo = (w)=>{
    if(!w || w==undefined){
        w = {};
    }
    return {
        id: w.id || '', //WorkOrderNumber

        custCode:w.custCode||'', //CustomerCode
        contactname:w.contactname||'',
        contactphone:w.contactphone||'',

        street:w.street||'',
        cityzip:w.cityzip||'',
        unit:w.unit||'',
        state:w.state||'',

        takenby:w.takenby||'', //TakenBy
        dept:w.dept||'', //SalesCategoryCode *needs " " trimming
        cat:w.cat||'', //WorkOrderCateogry *needs further referencing
        leadsource:w.leadsource||'',
        status:w.status||'', //WOStatusCode

        jobRef:w.jobRef||'',
        conRef:w.conRef||'',
        ref:w.ref||'',

        pricebook:w.pricebook||'', //FlatRateBook
        priceLevel:w.priceLevel||'', //PriceLevel

        salesrep:w.salesrep||'', //TerritorySalespersonCode
        tech:w.tech||'', //TechnicianID

        datecall:w.datecall||'',
        timecall:w.timecall||'',

        dateorder:w.dateorder||'',
        timeorder:w.timeorder||'',

        datescheduled:w.dateschedule||'',
        timescheduled:w.timeschedule||'',

        datestart:w.datestart||'',
        timestart:w.timestart||'',

        datedispatch:w.datedispatch||'',
        timedispatch:w.timedispatch||'',

        datearrival:w.datearrival||'',
        timearrival:w.timearrival||'',

        datecomplete:w.datecomplete||'',
        timecomplete:w.timecomplete||'',

        datecompletesched:w.datecompletesched||'',
        timecompletesched:w.timecompletesched||'',
    }
}

// Service Report Gen - DB_WO
var vjwomap = (vjwo = null) => {
    if (!vjwo || vjwo==undefined){
        vjwo = {}
    }
    return {
        id: String(vjwo['woNum     ']) || '',
        custCode:vjwo['custCode  ']||'',
        custName:vjwo['custName                           ']||'',
        custPhone1:vjwo['custPhone1     ']&&vjwo['custPhone1     ']!=undefined?String(vjwo['custPhone1     ']):'',
        custPhone2:vjwo['custPhone2     ']&&vjwo['custPhone2     ']!=undefined?String(vjwo['custPhone2     ']):'',
        custEmail:vjwo['custEmail                           ']||'',
        address:vjwo['custAddress                   ']||'',
        salesRep:vjwo['sales']||'',
        createBy:String(vjwo['takenBy '])||'',
        status:vjwo['stat']||'',
        callSource:vjwo['callS'] ||'',
        cat:String(vjwo['woCat          '])||'',
        catDescr:vjwo['woCatDescr                    ']||'',
        dept:String(vjwo['dept      '])||'',
        jobRef:vjwo['jobRef    ']||'',
        scRef:vjwo['scRef     ']||'',
        woRef:vjwo['woRef        ']||'',
        tech:String(vjwo['woTec'])||'',
        callDate:vjwo['callDate']?ExcelDateToJSDate(vjwo['callDate'],false):'',
        callTime:vjwo['callTime  ']||'',
        strtDate:vjwo['strtDate']?ExcelDateToJSDate(vjwo['strtDate'],false):'',
        strtTime:vjwo['strtTime']||'',
        tech:vjwo['tech ']||'',
        woDescr:vjwo['woDescr                                                     ']||''
    }
}

module.exports = {
    awo,
    vjwomap
}

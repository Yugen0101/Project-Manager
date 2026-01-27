import { verifyCard } from '@/app/actions/id-cards';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export const metadata = {
    title: 'Verify ID Card | TaskForge',
    description: 'Verify TaskForge ID card authenticity'
};

export default async function VerifyCardPage({
    params,
}: {
    params: Promise<{ cardNumber: string }>;
}) {
    const { cardNumber } = await params;
    const result = await verifyCard(cardNumber);

    if (!result.success || !result.data) {
        return (
            <div className="min-h-screen bg-[#f7f3ed] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-red-200 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircleIcon className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-semibold uppercase mb-4 text-red-600">Invalid Card</h1>
                    <p className="text-[#78716c] mb-6">
                        This ID card could not be verified. It may be invalid, revoked, or the card number is incorrect.
                    </p>
                    <p className="text-sm text-[#78716c]">
                        Card Number: <span className="font-semibold">{cardNumber}</span>
                    </p>
                </div>
            </div>
        );
    }

    const { data } = result;
    const isValid = data.status === 'active';

    const statusInfo = {
        active: { icon: CheckCircleIcon, color: 'green', label: 'Valid & Active' },
        revoked: { icon: XCircleIcon, color: 'red', label: 'Revoked' },
        suspended: { icon: XCircleIcon, color: 'yellow', label: 'Suspended' }
    };

    const status = statusInfo[data.status as keyof typeof statusInfo] || statusInfo.active;
    const StatusIcon = status.icon;

    return (
        <div className="min-h-screen bg-[#f7f3ed] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-2xl p-8 border border-[#e5dec9] shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold uppercase tracking-tight mb-2 text-[#1c1917]">TaskForge ID Verification</h1>
                    <p className="text-[#78716c]">Official ID Card Verification System</p>
                </div>

                {/* Status badge */}
                <div className={`flex items-center justify-center gap-3 p-6 rounded-xl mb-8 ${isValid ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                    }`}>
                    <StatusIcon className={`w-12 h-12 ${isValid ? 'text-green-600' : 'text-red-600'}`} />
                    <div>
                        <p className={`text-2xl font-semibold uppercase ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {status.label}
                        </p>
                        <p className="text-sm text-[#78716c] font-medium">
                            Verified on {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Card holder info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-6 p-6 bg-[#f7f3ed] rounded-xl">
                        {data.photoUrl && (
                            <Image
                                src={data.photoUrl}
                                alt={data.name}
                                width={100}
                                height={100}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        )}
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-1">Card Holder</p>
                            <p className="text-2xl font-semibold text-[#1c1917] uppercase">{data.name}</p>
                            <p className="text-sm font-semibold text-[#78716c] uppercase mt-1">{data.role}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#f7f3ed] rounded-xl">
                            <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-1">Card Number</p>
                            <p className="font-semibold text-[#1c1917]">{data.cardNumber}</p>
                        </div>
                        <div className="p-4 bg-[#f7f3ed] rounded-xl">
                            <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-1">Employee ID</p>
                            <p className="font-semibold text-[#1c1917]">{data.employeeId}</p>
                        </div>
                        {data.department && (
                            <div className="p-4 bg-[#f7f3ed] rounded-xl">
                                <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-1">Department</p>
                                <p className="font-semibold text-[#1c1917]">{data.department}</p>
                            </div>
                        )}
                        <div className="p-4 bg-[#f7f3ed] rounded-xl">
                            <p className="text-xs font-semibold text-[#78716c] uppercase tracking-wider mb-1">Issue Date</p>
                            <p className="font-semibold text-[#1c1917]">{new Date(data.issueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-[#e5dec9] text-center">
                    <p className="text-xs text-[#78716c] font-semibold">
                        This verification was performed using TaskForge's secure verification system.
                        {!isValid && ' This card is not currently valid for access.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

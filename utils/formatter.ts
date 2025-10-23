// Dosya: ismarliyorumApp/utils/formatter.ts

/**
 * Çeşitli formatlardaki bir Türk telefon numarasını
 * standart 10 haneli formata (5xx xxx xx xx) dönüştürür.
 */
export const normalizePhone = (phone: string | null | undefined): string => {
    if (!phone) return '';
    // Rakamlar dışındaki tüm karakterleri temizle
    const justDigits = phone.replace(/\D/g, '');
    // Numaranın son 10 hanesini al
    const trNumber = justDigits.slice(-10);

    // '5' ile başlayıp 10 haneli olduğunu kontrol et
    if (trNumber.length === 10 && trNumber.startsWith('5')) {
        return trNumber;
    }
    // Geçersizse boş string dön (veya null, projenin tutarlılığına göre)
    return '';
};
function [BWI,resid] = yimaaInnerSegm(I,BW,ls,lh,preprocess)
% Segmentation of inner structures in fluffy yeast colonies. Band-pass
% filtering is used for enhancing structures in colonies and structures
% with intensity higher thant MAD/fixed threshold are segmented as colony "inner
% structures".
%
% IN:
%      I              Input image (double)
%      BW             Binary mask for the object
%      ls             Gaussian lowpass filter size (first)
%      lh             Gaussian lowpass filter size (second)
%      preprocess     (optional) true/false, if true, smoothen the image before processing (Gaussian lpf)

% 29.4.2013 (c) Pekka Ruusuvuori, pekka.ruusuvuori@tut.fi

if nargin < 5
    preprocess = false;
end

method = 'fixed';  % 'fixed';'MAD'

backgroundCorrected = I;

if preprocess == true
    filterSize = 7; % try different values to tune the result
    backgroundCorrected = imfilter(backgroundCorrected,fspecial('gaussian',filterSize,filterSize));
end

% border handling & replace background values by median
if sum(sum(BW)) > 0
    borderBW = BW - imerode(BW,ones(3));
    backgroundCorrected(BW==0) = median(I(borderBW==1));
end
clear BorderBW;

H_low = fspecial('gaussian',ls,ls);
S_low = imfilter(backgroundCorrected,H_low);
H_high = fspecial('gaussian',lh,lh);
S_high = imfilter(backgroundCorrected,H_high);


D = BW.*(double(S_low)-double(S_high));

switch method
    case 'MAD'
        th = mad(D(:));
    case 'fixed'
        th = -0.2;
    otherwise
        error('Unknown method')
end
BWI = D > th; 
BWI = BWI.*BW;

% figure(3)
% subplot(121)
% imshow(I,[]), impixelinfo
% subplot(122)
% imshow(BWI,[])%, title(num2str(thMad))


% calculate features
ris = double(I)-double(S_high);
rs = double(I)-double(S_low);
resid(1) = mean(ris(~isnan(ris)));
resid(2) = std(ris(~isnan(ris)));
resid(3) = mean(rs(~isnan(rs)));
resid(4) = std(rs(~isnan(rs)));

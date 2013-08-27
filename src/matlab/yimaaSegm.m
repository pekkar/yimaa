function [bw,th] = yimaaSegm(raw,segmMethod,alphafac,sizelim,normalize)
if nargin < 2
    segmMethod = 'graythresh';
end
if nargin < 3
    alphafac = .9;
end
if nargin < 4
    sizelim = 0.001;
end
if nargin < 5
    normalize = false;
end

if normalize
    raw = double(raw);
    raw = raw - min(raw(:));
    raw = raw/max(raw(:)) * 255;
end
if strcmp(segmMethod,'graythresh')
    th = alphafac*255*graythresh(raw);
else
    disp('Add e.g. HistThresh (http://www.cs.tut.fi/~ant/histthresh/) to path and try other methods here (not implemented here)')
end

bw = raw > th;
bw = imfill(bw,'holes');
bw = bwareaopen(bw,round(numel(bw)*sizelim));
bw = imclearborder(bw);

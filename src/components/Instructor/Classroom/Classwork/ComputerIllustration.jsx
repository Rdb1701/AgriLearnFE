export default function ComputerIllustration() {
  return (
    <>
      <style>{illustrationStyles}</style>
      <div className="mb-4 position-relative d-inline-block computer-container">
        <div className="position-relative mx-auto monitor">
          <div className="position-absolute top-50 start-50 translate-middle screen"></div>
        </div>
        <div className="mx-auto monitor-stand"></div>
        <div className="mx-auto monitor-base"></div>
        <div className="mx-auto mt-2 keyboard"></div>
        <div className="position-absolute mouse"></div>
        <div className="position-absolute character">
          <div className="mx-auto mb-1 character-head"></div>
          <div className="mx-auto character-body"></div>
          <div className="position-absolute character-arm-left"></div>
          <div className="position-absolute character-arm-right"></div>
        </div>
      </div>
    </>
  );
}

const illustrationStyles = `
    .computer-container { width: 200px; height: 140px; }
    .monitor { width: 120px; height: 80px; background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%); border: 3px solid #6c757d; border-radius: 8px; }
    .screen { width: 100px; height: 60px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 4px; }
    .monitor-stand { width: 30px; height: 15px; background-color: #6c757d; border-radius: 0 0 6px 6px; margin-top: -2px; }
    .monitor-base { width: 60px; height: 8px; background-color: #6c757d; border-radius: 10px; margin-top: 2px; }
    .keyboard { width: 80px; height: 12px; background-color: #adb5bd; border-radius: 4px; }
    .mouse { width: 20px; height: 12px; background-color: #adb5bd; border-radius: 8px; bottom: 0; right: -10px; }
    .character { right: -80px; top: -20px; }
    .character-head { width: 25px; height: 25px; background-color: #dee2e6; border-radius: 50%; }
    .character-body { width: 20px; height: 35px; background-color: #dee2e6; border-radius: 10px 10px 0 0; }
    .character-arm-left { width: 15px; height: 4px; background-color: #dee2e6; border-radius: 2px; top: 35px; left: -8px; transform: rotate(-20deg); }
    .character-arm-right { width: 15px; height: 4px; background-color: #dee2e6; border-radius: 2px; top: 35px; right: -8px; transform: rotate(20deg); }
  `;
